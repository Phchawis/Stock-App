// Runs before every /api/* request. Enforces a valid session for all endpoints
// except the public ones, and attaches the authenticated user to context.data.auth.
import { getAuth, json } from './_lib.js';

const PUBLIC_PATHS = new Set(['/api/login', '/api/logout']);
// Cookies are sent automatically by the browser on every request, including
// ones a malicious third-party site tricks the user into firing (CSRF). A
// custom header can't be forged that way — cross-site JS can't read the
// session or csrf cookies to construct it — so requiring it on every state-
// changing request blocks CSRF without weakening the httpOnly session cookie.
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export async function onRequest(context) {
  const { pathname } = new URL(context.request.url);
  if (PUBLIC_PATHS.has(pathname)) return context.next();

  const auth = await getAuth(context);
  if (!auth) return json({ error: 'ต้องเข้าสู่ระบบก่อน' }, 401);

  if (!SAFE_METHODS.has(context.request.method)) {
    const csrfHeader = context.request.headers.get('X-CSRF-Token') || '';
    if (!csrfHeader || csrfHeader !== auth.csrf) {
      return json({ error: 'คำขอไม่ผ่านการตรวจสอบ CSRF กรุณาโหลดหน้าใหม่แล้วลองอีกครั้ง' }, 403);
    }
  }

  context.data.auth = { username: auth.username, role: auth.role };
  return context.next();
}
