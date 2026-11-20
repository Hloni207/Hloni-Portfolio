import fs from 'fs';
import path from 'path';
import { verifyAdminRequest } from '@/lib/auth';
import { commitFileToGitHub, getGitHubConfig } from '@/lib/github';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '30mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Verify admin authentication
  if (!verifyAdminRequest(req)) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Admin authentication required to upload media.'
    });
  }

  try {
    const { name, base64Data } = req.body || {};
    if (!name || !base64Data) {
      return res.status(400).json({ success: false, error: 'Missing name or base64Data' });
    }

    // Clean and sanitize filename
    const sanitizedName = name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
    const isPdf = sanitizedName.endsWith('.pdf');
    const fileName = sanitizedName.startsWith('resume')
      ? 'resume.pdf'
      : `${Date.now()}_${sanitizedName}`;

    // Extract raw base64 content
    const base64Content = base64Data.replace(/^data:[a-zA-Z0-9/+.-]+;base64,/, '');
    const buffer = Buffer.from(base64Content, 'base64');

    const isLocal = !process.env.VERCEL && fs.existsSync(path.join(process.cwd(), '.git'));
    const { isConfigured } = getGitHubConfig();

    // In local development, write to disk
    if (isLocal || fs.existsSync(path.join(process.cwd(), 'public'))) {
      try {
        const publicMediaDir = path.join(process.cwd(), 'public', 'media');
        const srcMediaDir = path.join(process.cwd(), 'src', 'media');
        if (!fs.existsSync(publicMediaDir)) fs.mkdirSync(publicMediaDir, { recursive: true });
        if (!fs.existsSync(srcMediaDir)) fs.mkdirSync(srcMediaDir, { recursive: true });

        fs.writeFileSync(path.join(publicMediaDir, fileName), buffer);
        fs.writeFileSync(path.join(srcMediaDir, fileName), buffer);
      } catch (e) {
        console.warn('Local disk write warning:', e.message);
      }
    }

    // If GITHUB_TOKEN is configured, commit directly to GitHub repository
    if (isConfigured) {
      await commitFileToGitHub({
        filePath: `public/media/${fileName}`,
        base64Content,
        commitMessage: `chore(media): upload ${fileName} to public/media`,
      });
      // Also sync to src/media for backwards compatibility
      try {
        await commitFileToGitHub({
          filePath: `src/media/${fileName}`,
          base64Content,
          commitMessage: `chore(media): sync ${fileName} to src/media`,
        });
      } catch (e) {
        // Non-blocking
      }
    } else if (!isLocal) {
      // Running on Vercel without GITHUB_TOKEN
      return res.status(500).json({
        success: false,
        error: 'GITHUB_TOKEN_MISSING',
        message: 'GITHUB_TOKEN environment variable is missing on Vercel. Please add GITHUB_TOKEN to your Vercel Project Settings > Environment Variables so uploaded files can be saved permanently.',
      });
    }

    return res.status(200).json({
      success: true,
      url: `/media/${fileName}`,
      fileName,
      message: 'Media uploaded and saved successfully.',
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload media',
    });
  }
}
