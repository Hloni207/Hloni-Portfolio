import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

// Helper: Commit a file to GitHub via REST API
async function commitFileToGitHub(repo, filePath, base64Content, commitMessage, token) {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Hloni-Portfolio-CMS',
    'Content-Type': 'application/json',
  };

  let sha = undefined;
  try {
    const getRes = await fetch(url, { headers });
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }
  } catch (err) {}

  const putBody = {
    message: commitMessage,
    content: base64Content,
    branch: 'main',
  };
  if (sha) putBody.sha = sha;

  const putRes = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(putBody),
  });

  return putRes.ok;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, base64Data, githubToken } = req.body;
    if (!name || !base64Data) {
      return res.status(400).json({ error: 'Missing name or base64Data' });
    }

    // Clean filename
    const sanitizedName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = sanitizedName.startsWith('resume') ? 'resume.pdf' : `${Date.now()}_${sanitizedName}`;

    // Extract raw base64 content
    const base64Content = base64Data.replace(/^data:[a-zA-Z0-9/+.-]+;base64,/, '');
    const buffer = Buffer.from(base64Content, 'base64');

    const isLocal = !process.env.VERCEL && fs.existsSync(path.join(process.cwd(), '.git'));
    const token = githubToken || process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO || 'Hloni207/Hloni-Portfolio';

    // 1. Write locally if possible
    if (isLocal || fs.existsSync(path.join(process.cwd(), 'src'))) {
      const srcMediaDir = path.join(process.cwd(), 'src', 'media');
      const publicMediaDir = path.join(process.cwd(), 'public', 'media');

      if (!fs.existsSync(srcMediaDir)) fs.mkdirSync(srcMediaDir, { recursive: true });
      if (!fs.existsSync(publicMediaDir)) fs.mkdirSync(publicMediaDir, { recursive: true });

      fs.writeFileSync(path.join(srcMediaDir, fileName), buffer);
      fs.writeFileSync(path.join(publicMediaDir, fileName), buffer);

      // Auto commit and push media to GitHub via local git!
      if (isLocal) {
        try {
          execSync(`git add src/media/${fileName} public/media/${fileName}`, { stdio: 'pipe' });
          execSync(`git commit -m "chore(media): upload ${fileName} to media folder"`, { stdio: 'pipe' });
          execSync('git push origin main', { stdio: 'pipe' });
          console.log(`Pushed ${fileName} to GitHub origin/main successfully!`);
        } catch (gitErr) {
          console.warn('Local git auto-commit note:', gitErr.message);
        }
      }
    }

    // 2. If running on Vercel or token is available, push directly to GitHub API
    if (token) {
      try {
        await commitFileToGitHub(repo, `public/media/${fileName}`, base64Content, `chore(media): upload ${fileName}`, token);
        await commitFileToGitHub(repo, `src/media/${fileName}`, base64Content, `chore(media): upload ${fileName}`, token);
      } catch (apiErr) {
        console.warn('GitHub API upload error:', apiErr);
      }
    }

    return res.status(200).json({
      success: true,
      url: `/media/${fileName}`,
      fileName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message || 'Failed to save file' });
  }
}
