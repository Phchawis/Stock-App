// Shared helpers for the Pages Functions API: password hashing, session tokens,
// server-side authorization, and Bangkok-local timestamps.
// Files prefixed with "_" are NOT routed by Cloudflare Pages — this is a plain module.

const encoder = new TextEncoder();

function bytesToHex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

// ── passwords (PBKDF2-SHA256 via Web Crypto) ──────────────────────────────
export async function hashPassword(password, saltHex) {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256
  );
  return bytesToHex(salt) + ':' + bytesToHex(bits);
}
export function isHashed(stored) {
  return typeof stored === 'string' && stored.includes(':');
}
export async function verifyPassword(password, stored) {
  if (!stored) return false;
  if (!isHashed(stored)) return password === stored;          // legacy plaintext
  const [saltHex, hashHex] = stored.split(':');
  const check = (await hashPassword(password, saltHex)).split(':')[1];
  if (check.length !== hashHex.length) return false;
  let diff = 0;
  for (let i = 0; i < check.length; i++) diff |= check.charCodeAt(i) ^ hashHex.charCodeAt(i);
  return diff === 0;
}

// ── sessions ──────────────────────────────────────────────────────────────
// Auth lives in an httpOnly cookie (not JS-readable, so it can't be exfiltrated
// via XSS) plus a separate, JS-readable CSRF cookie the frontend must echo back
// as a header on every mutating request — the classic double-submit pattern.
// A plain header-only bearer token would be simpler but can't be httpOnly;
// cookies are the only way to keep the session credential out of reach of
// injected scripts.
const SESSION_HOURS = 12;
export const SESSION_COOKIE = 'tuh_session';
export const CSRF_COOKIE = 'tuh_csrf';

export function newToken() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}
export function sessionExpiry() {
  return new Date(Date.now() + SESSION_HOURS * 3600 * 1000).toISOString();
}

export function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return '';
}
// Builds one Set-Cookie header value. `request` decides whether to mark the
// cookie Secure — browsers silently drop Secure cookies on plain http://,
// which is how `wrangler pages dev` serves local dev, so it must be
// conditional or session cookies would never be set outside production.
export function setCookieHeader(request, name, value, { httpOnly = true, maxAgeSec } = {}) {
  const isHttps = new URL(request.url).protocol === 'https:';
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'SameSite=Lax'];
  if (httpOnly) parts.push('HttpOnly');
  if (isHttps) parts.push('Secure');
  parts.push(maxAgeSec != null ? `Max-Age=${maxAgeSec}` : 'Max-Age=0');
  return parts.join('; ');
}
// Applies the login (Set-Cookie session + csrf) or logout (clear both) cookies
// onto a Response, since Headers needs `append` to send multiple Set-Cookie
// values — assigning twice would silently overwrite the first.
export function withSessionCookies(response, request, { token, csrf, clear = false } = {}) {
  const maxAgeSec = clear ? 0 : SESSION_HOURS * 3600;
  response.headers.append('Set-Cookie', setCookieHeader(request, SESSION_COOKIE, clear ? '' : token, { httpOnly: true, maxAgeSec }));
  response.headers.append('Set-Cookie', setCookieHeader(request, CSRF_COOKIE, clear ? '' : csrf, { httpOnly: false, maxAgeSec }));
  return response;
}

// Returns { username, role, csrf } for a valid, unexpired session, else null.
export async function getAuth(context) {
  const token = getCookie(context.request, SESSION_COOKIE);
  if (!token) return null;
  const row = await context.env.DB
    .prepare('SELECT username, role, csrf, expires_at FROM sessions WHERE token = ?')
    .bind(token).first();
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await context.env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return null;
  }
  return { username: row.username, role: row.role, csrf: row.csrf };
}

// ── login rate limiting ──────────────────────────────────────────────────
// Throttles brute-force/credential-stuffing against a known username (there
// are only 4 accounts in this app, so guessing passwords is the realistic
// attack). Keyed by username rather than IP: that's the account actually at
// risk, and it also throttles guesses against a nonexistent username the same
// way, so it doesn't leak which usernames are valid via timing/behavior.
const MAX_LOGIN_FAILS = 5;
const LOCK_MINUTES = 15;
export async function isLoginLocked(env, username) {
  const row = await env.DB.prepare('SELECT locked_until FROM login_attempts WHERE username = ?').bind(username).first();
  return !!(row && row.locked_until && new Date(row.locked_until).getTime() > Date.now());
}
export async function recordLoginFailure(env, username) {
  const row = await env.DB.prepare('SELECT fail_count FROM login_attempts WHERE username = ?').bind(username).first();
  const count = (row ? row.fail_count : 0) + 1;
  const lockedUntil = count >= MAX_LOGIN_FAILS ? new Date(Date.now() + LOCK_MINUTES * 60000).toISOString() : null;
  const nextCount = lockedUntil ? 0 : count; // lock trips → reset the counter for the next window
  await env.DB.prepare(
    `INSERT INTO login_attempts (username, fail_count, locked_until) VALUES (?, ?, ?)
     ON CONFLICT(username) DO UPDATE SET fail_count = excluded.fail_count, locked_until = excluded.locked_until`
  ).bind(username, nextCount, lockedUntil).run();
}
export async function clearLoginFailures(env, username) {
  await env.DB.prepare('DELETE FROM login_attempts WHERE username = ?').bind(username).run();
}

// ── authorization ─────────────────────────────────────────────────────────
export async function roleAllows(env, role, perm) {
  const row = await env.DB
    .prepare('SELECT allowed FROM permissions WHERE role = ? AND perm = ?')
    .bind(role, perm).first();
  return !!(row && row.allowed);
}
// Guard for write endpoints. Reads context.data.auth (set by _middleware.js).
// Returns a Response to short-circuit on failure, or null to proceed.
export async function requirePerm(context, { perm, adminOnly } = {}) {
  const auth = context.data && context.data.auth;
  if (!auth) return json({ error: 'ต้องเข้าสู่ระบบก่อน' }, 401);
  if (adminOnly && auth.role !== 'admin') return json({ error: 'ต้องเป็นผู้ดูแลระบบ (Admin) เท่านั้น' }, 403);
  if (perm && !(await roleAllows(context.env, auth.role, perm))) {
    return json({ error: 'บทบาทนี้ไม่มีสิทธิ์ดำเนินการนี้' }, 403);
  }
  return null;
}
// Display name of the authenticated user (for trustworthy audit "by" fields).
export async function actorName(context) {
  const auth = context.data && context.data.auth;
  if (!auth) return 'unknown';
  const row = await context.env.DB.prepare('SELECT name FROM users WHERE username = ?').bind(auth.username).first();
  return (row && row.name) || auth.username;
}

// ── misc ──────────────────────────────────────────────────────────────────
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
// 'YYYY-MM-DD HH:MM' in Asia/Bangkok (UTC+7). Workers run in UTC.
export function nowStr() {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 16).replace('T', ' ');
}
