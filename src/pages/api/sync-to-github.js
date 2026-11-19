import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
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
  } catch (err) {
    console.warn(`Could not check existing sha for ${filePath}`, err);
  }

  const putBody = {
    message: commitMessage,
    content: base64Content,
    branch: 'main',
  };
  if (sha) {
    putBody.sha = sha;
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(putBody),
  });

  if (!putRes.ok) {
    const errData = await putRes.json().catch(() => ({}));
    throw new Error(`GitHub API error (${putRes.status}): ${errData.message || putRes.statusText}`);
  }

  return await putRes.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { portfolioData, mediaFiles = [], githubToken } = req.body;

    if (!portfolioData) {
      return res.status(400).json({ error: 'Missing portfolioData' });
    }

    const token = githubToken || process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO || 'Hloni207/Hloni-Portfolio';
    const isLocal = !process.env.VERCEL && fs.existsSync(path.join(process.cwd(), '.git'));

    // ─────────────────────────────────────────────────────────────
    // STRATEGY 1: Local Environment with Git CLI available
    // ─────────────────────────────────────────────────────────────
    if (isLocal) {
      try {
        const publicDataDir = path.join(process.cwd(), 'public', 'data');
        const srcDataDir = path.join(process.cwd(), 'src', 'data');
        const srcMediaDir = path.join(process.cwd(), 'src', 'media');
        const publicMediaDir = path.join(process.cwd(), 'public', 'media');

        if (!fs.existsSync(publicDataDir)) fs.mkdirSync(publicDataDir, { recursive: true });
        if (!fs.existsSync(srcDataDir)) fs.mkdirSync(srcDataDir, { recursive: true });
        if (!fs.existsSync(srcMediaDir)) fs.mkdirSync(srcMediaDir, { recursive: true });
        if (!fs.existsSync(publicMediaDir)) fs.mkdirSync(publicMediaDir, { recursive: true });

        // 1. Write public/data/portfolio.json
        const jsonContent = JSON.stringify(portfolioData, null, 2);
        fs.writeFileSync(path.join(publicDataDir, 'portfolio.json'), jsonContent, 'utf8');

        // 2. Write src/data/initialData.js
        const jsContent = `export const initialPortfolioData = ${jsonContent};\n`;
        fs.writeFileSync(path.join(srcDataDir, 'initialData.js'), jsContent, 'utf8');

        // 3. Save any media files passed
        for (const file of mediaFiles) {
          if (file.name && file.base64Content) {
            const cleanBase64 = file.base64Content.replace(/^data:[a-zA-Z0-9/+.-]+;base64,/, '');
            const buffer = Buffer.from(cleanBase64, 'base64');
            fs.writeFileSync(path.join(srcMediaDir, file.name), buffer);
            fs.writeFileSync(path.join(publicMediaDir, file.name), buffer);
          }
        }

        // 4. Run Git commit & push
        try {
          execSync('git add -A', { stdio: 'pipe' });
          const status = execSync('git status --porcelain', { encoding: 'utf8' });
          if (status.trim()) {
            execSync('git commit -m "chore(cms): sync portfolio content and media to GitHub"', { stdio: 'pipe' });
            execSync('git push origin main', { stdio: 'pipe' });
            return res.status(200).json({
              success: true,
              method: 'local_git',
              message: 'Successfully saved and pushed to GitHub main branch! Vercel is now deploying your changes.',
            });
          } else {
            return res.status(200).json({
              success: true,
              method: 'local_git',
              message: 'Files are already up-to-date with GitHub main branch.',
            });
          }
        } catch (gitErr) {
          console.error('Git execution error:', gitErr);
          // If git command fails (e.g., credentials or offline), check if we can fall back to GitHub token
          if (!token) {
            return res.status(200).json({
              success: true,
              method: 'local_disk_only',
              warning: 'Saved locally to disk, but git push had an issue: ' + (gitErr.message || 'Check terminal'),
            });
          }
        }
      } catch (diskErr) {
        console.error('Local disk write error:', diskErr);
        if (!token) throw diskErr;
      }
    }

    // ─────────────────────────────────────────────────────────────
    // STRATEGY 2: Cloud / Remote (Vercel) using GitHub REST API
    // ─────────────────────────────────────────────────────────────
    if (token) {
      const jsonContent = JSON.stringify(portfolioData, null, 2);
      const jsContent = `export const initialPortfolioData = ${jsonContent};\n`;

      // 1. Commit public/data/portfolio.json
      await commitFileToGitHub(
        repo,
        'public/data/portfolio.json',
        Buffer.from(jsonContent, 'utf8').toString('base64'),
        'chore(cms): update public/data/portfolio.json',
        token
      );

      // 2. Commit src/data/initialData.js
      await commitFileToGitHub(
        repo,
        'src/data/initialData.js',
        Buffer.from(jsContent, 'utf8').toString('base64'),
        'chore(cms): update src/data/initialData.js',
        token
      );

      // 3. Commit any media files
      for (const file of mediaFiles) {
        if (file.name && file.base64Content) {
          const cleanBase64 = file.base64Content.replace(/^data:[a-zA-Z0-9/+.-]+;base64,/, '');
          // Commit to public/media
          await commitFileToGitHub(
            repo,
            `public/media/${file.name}`,
            cleanBase64,
            `chore(media): upload public/media/${file.name}`,
            token
          );
          // Commit to src/media
          await commitFileToGitHub(
            repo,
            `src/media/${file.name}`,
            cleanBase64,
            `chore(media): upload src/media/${file.name}`,
            token
          );
        }
      }

      return res.status(200).json({
        success: true,
        method: 'github_api',
        message: 'Successfully committed all changes directly to GitHub! Vercel is now building and deploying your live site (~30 seconds).',
      });
    }

    // If neither local git push nor token is available
    return res.status(400).json({
      success: false,
      error: 'NO_TOKEN_OR_GIT',
      message: 'To apply changes to GitHub from any device or browser, please provide a GitHub Personal Access Token in the "Sync to GitHub" tab.',
    });

  } catch (error) {
    console.error('Sync to GitHub error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to sync to GitHub',
    });
  }
}
