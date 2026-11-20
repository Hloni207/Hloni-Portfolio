export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isProd = process.env.NODE_ENV === 'production';
  const cookieFlags = [
    'admin_session=',
    'Max-Age=0',
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    ...(isProd ? ['Secure'] : [])
  ].join('; ');

  res.setHeader('Set-Cookie', cookieFlags);

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
}
