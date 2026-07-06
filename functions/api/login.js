import {
  verifyPassword, isHashed, hashPassword, newToken, sessionExpiry, json,
  withSessionCookies, isLoginLocked, recordLoginFailure, clearLoginFailures,
} from './_lib.js';

export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const { username, password } = await request.json();
    if (!username || !password) return json({ error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' }, 400);

    const u = String(username).trim().toLowerCase();

    if (await isLoginLocked(env, u)) {
      return json({ error: 'เข้าสู่ระบบผิดพลาดหลายครั้งเกินไป กรุณาลองใหม่อีกครั้งใน 15 นาที' }, 429);
    }

    const user = await env.DB.prepare('SELECT * FROM users WHERE lower(username) = ?').bind(u).first();
    // Same failure path for "no such user" and "wrong password" — both record
    // a strike against the typed username and return an identical message, so
    // a brute-force script can't use the response to enumerate valid accounts.
    if (!user || !(await verifyPassword(password, user.password))) {
      await recordLoginFailure(env, u);
      return json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, 401);
    }
    await clearLoginFailures(env, u);

    // Transparently upgrade any legacy plaintext password to a salted hash.
    if (!isHashed(user.password)) {
      const hashed = await hashPassword(password);
      await env.DB.prepare('UPDATE users SET password = ? WHERE username = ?').bind(hashed, user.username).run();
    }

    const token = newToken();
    const csrf = newToken();
    await env.DB.prepare('INSERT INTO sessions (token, username, role, expires_at, csrf) VALUES (?, ?, ?, ?, ?)')
      .bind(token, user.username, user.role, sessionExpiry(), csrf).run();
    // Opportunistic cleanup of expired sessions.
    await env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(new Date().toISOString()).run();

    // The session token itself never reaches the JSON body / JS-land — only
    // the httpOnly cookie carries it. The CSRF cookie is JS-readable on
    // purpose (the frontend must echo it back as a header on writes).
    const res = json({
      user: { username: user.username, name: user.name, role: user.role, initials: user.initials, color: user.color, signature: user.signature }
    });
    return withSessionCookies(res, request, { token, csrf });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
