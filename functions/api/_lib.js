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
const SESSION_HOURS = 12;
export function newToken() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}
export function sessionExpiry() {
  return new Date(Date.now() + SESSION_HOURS * 3600 * 1000).toISOString();
}
export function bearer(request) {
  const h = request.headers.get('Authorization') || '';
  return h.startsWith('Bearer ') ? h.slice(7).trim() : '';
}
// Returns { username, role } for a valid, unexpired session, else null.
export async function getAuth(context) {
  const token = bearer(context.request);
  if (!token) return null;
  const row = await context.env.DB
    .prepare('SELECT username, role, expires_at FROM sessions WHERE token = ?')
    .bind(token).first();
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await context.env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return null;
  }
  return { username: row.username, role: row.role };
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
