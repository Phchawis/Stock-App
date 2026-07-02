import { bearer, json } from './_lib.js';

export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const token = bearer(request);
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
