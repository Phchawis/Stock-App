import { getCookie, SESSION_COOKIE, withSessionCookies, json } from './_lib.js';

export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const token = getCookie(request, SESSION_COOKIE);
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return withSessionCookies(json({ success: true }), request, { clear: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
