import { verifyAdminRequest } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isAuthenticated = verifyAdminRequest(req);

  return res.status(200).json({
    authenticated: isAuthenticated,
  });
}
