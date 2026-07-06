import { json } from '../_lib.js';

export async function onRequestPost(context) {
  const auth = context.data && context.data.auth;
  if (!auth) return json({ error: 'ต้องเข้าสู่ระบบก่อน' }, 401);

  const { env, request } = context;
  try {
    const { signature } = await request.json();
    await env.DB.prepare('UPDATE users SET signature = ? WHERE username = ?')
      .bind(signature, auth.username).run();

    return json({ success: true, signature });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
