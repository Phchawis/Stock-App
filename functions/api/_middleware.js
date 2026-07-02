// Runs before every /api/* request. Enforces a valid session for all endpoints
// except the public ones, and attaches the authenticated user to context.data.auth.
import { getAuth, json } from './_lib.js';

const PUBLIC_PATHS = new Set(['/api/login', '/api/logout']);

export async function onRequest(context) {
  const { pathname } = new URL(context.request.url);
  if (PUBLIC_PATHS.has(pathname)) return context.next();

  const auth = await getAuth(context);
  if (!auth) return json({ error: 'ต้องเข้าสู่ระบบก่อน' }, 401);

  context.data.auth = auth;
  return context.next();
}
