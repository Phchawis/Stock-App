import { verifyPassword, isHashed, hashPassword, newToken, sessionExpiry, json } from './_lib.js';

export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const { username, password } = await request.json();
    if (!username || !password) return json({ error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' }, 400);

    const u = String(username).trim().toLowerCase();
    const user = await env.DB.prepare('SELECT * FROM users WHERE lower(username) = ?').bind(u).first();
    if (!user) return json({ error: 'ไม่พบชื่อผู้ใช้นี้ในระบบ' }, 401);

    const ok = await verifyPassword(password, user.password);
    if (!ok) return json({ error: 'รหัสผ่านไม่ถูกต้อง' }, 401);

    // Transparently upgrade any legacy plaintext password to a salted hash.
    if (!isHashed(user.password)) {
      const hashed = await hashPassword(password);
      await env.DB.prepare('UPDATE users SET password = ? WHERE username = ?').bind(hashed, user.username).run();
    }

    const token = newToken();
    await env.DB.prepare('INSERT INTO sessions (token, username, role, expires_at) VALUES (?, ?, ?, ?)')
      .bind(token, user.username, user.role, sessionExpiry()).run();
    // Opportunistic cleanup of expired sessions.
    await env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(new Date().toISOString()).run();

    return json({
      token,
      user: { username: user.username, name: user.name, role: user.role, initials: user.initials, color: user.color }
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
