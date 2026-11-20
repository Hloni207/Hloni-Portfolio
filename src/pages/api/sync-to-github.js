import fs from 'fs';
import path from 'path';
import { verifyAdminRequest } from '@/lib/auth';
import { commitMultipleFilesToGitHub, getGitHubConfig } from '@/lib/github';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
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
      message: 'Admin authentication required to publish content to GitHub.'
    });
  }

  try {
    const { portfolioData, mediaFiles = [] } = req.body || {};

    if (!portfolioData) {
      return res.status(400).json({ success: false, error: 'Missing portfolioData' });
    }

    const jsonContent = JSON.stringify(portfolioData, null, 2);
    const jsContent = `export const initialPortfolioData = ${jsonContent};\n`;

    // 2. In local environment, write to disk directly
    const isLocal = !process.env.VERCEL && fs.existsSync(path.join(process.cwd(), '.git'));
    if (isLocal || fs.existsSync(path.join(process.cwd(), 'public'))) {
      try {
        const publicDataDir = path.join(process.cwd(), 'public', 'data');
        const srcDataDir = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(publicDataDir)) fs.mkdirSync(publicDataDir, { recursive: true });
        if (!fs.existsSync(srcDataDir)) fs.mkdirSync(srcDataDir, { recursive: true });

        fs.writeFileSync(path.join(publicDataDir, 'portfolio.json'), jsonContent, 'utf8');
        fs.writeFileSync(path.join(srcDataDir, 'initialData.js'), jsContent, 'utf8');
      } catch (e) {
        console.warn('Local disk write warning:', e.message);
      }
    }

    // 3. Prepare files to commit to GitHub
    const filesToCommit = [
      {
        path: 'public/data/portfolio.json',
        content: jsonContent,
        isBase64: false,
      },
      {
        path: 'src/data/initialData.js',
        content: jsContent,
        isBase64: false,
      },
    ];

    // Include any pending media files
    for (const file of mediaFiles) {
      if (file.name && file.base64Content) {
        const cleanBase64 = file.base64Content.replace(/^data:[a-zA-Z0-9/+.-]+;base64,/, '');
        filesToCommit.push({
          path: `public/media/${file.name}`,
          content: cleanBase64,
          isBase64: true,
        });
        filesToCommit.push({
          path: `src/media/${file.name}`,
          content: cleanBase64,
          isBase64: true,
        });
      }
    }

    // 4. Commit to GitHub (atomically commits all files in ONE commit)
    const commitResult = await commitMultipleFilesToGitHub({
      files: filesToCommit,
      commitMessage: 'chore(portfolio): publish updates from admin studio',
    });

    return res.status(200).json({
      success: true,
      ...commitResult,
    });
  } catch (error) {
    console.error('Publish error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to publish to GitHub',
    });
  }
}
