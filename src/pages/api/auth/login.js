import { checkPassword, createSessionToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};

  if (!checkPassword(password)) {
    return res.status(401).json({ success: false, error: 'INVALID_PASSWORD', message: 'Incorrect admin password.' });
  }

  const token = createSessionToken();
  const isProd = process.env.NODE_ENV === 'production';
  
  // Set HttpOnly cookie for seamless session management
  const maxAge = 14 * 24 * 60 * 60; // 14 days in seconds
  const cookieFlags = [
    `admin_session=${token}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    ...(isProd ? ['Secure'] : [])
  ].join('; ');

  res.setHeader('Set-Cookie', cookieFlags);

  return res.status(200).json({
    success: true,
    token,
    message: 'Authenticated successfully.'
  });
}
