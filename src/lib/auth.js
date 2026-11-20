import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hloni2026';
const SESSION_SECRET = process.env.SESSION_SECRET || ADMIN_PASSWORD || 'hloni-portfolio-secure-session-key-2026';
const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export function checkPassword(password) {
  if (!password) return false;
  return password === ADMIN_PASSWORD;
}

export function createSessionToken() {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(timestamp).digest('hex');
  return `${timestamp}.${hmac}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestamp, signature] = parts;
  const timeNum = parseInt(timestamp, 10);
  if (isNaN(timeNum)) return false;

  // Check expiration
  if (Date.now() - timeNum > SESSION_MAX_AGE_MS) {
    return false;
  }

  // Verify HMAC signature
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(timestamp).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
  } catch (e) {
    return false;
  }
}

export function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });

  return list;
}

export function verifyAdminRequest(req) {
  // 1. Check Authorization header (Bearer token)
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    if (verifySessionToken(bearerToken)) return true;
    if (bearerToken === ADMIN_PASSWORD) return true; // Direct API password fallback
  }

  // 2. Check admin_session cookie
  const cookies = parseCookies(req.headers['cookie']);
  const sessionCookie = cookies['admin_session'];
  if (sessionCookie && verifySessionToken(sessionCookie)) {
    return true;
  }

  return false;
}
