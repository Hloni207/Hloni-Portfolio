import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'Hloni207';
  const repo = process.env.GITHUB_REPO || 'Hloni-Portfolio';
  const branch = process.env.GITHUB_BRANCH || 'main';

  return {
    token,
    owner,
    repo,
    branch,
    isConfigured: Boolean(token),
  };
}

const GITHUB_API_BASE = 'https://api.github.com';

function getHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Hloni-Portfolio-Studio/2.0',
    'Content-Type': 'application/json',
  };
}

/**
 * Commit a single file (e.g. uploaded image or document) to GitHub via Contents API
 */
export async function commitFileToGitHub({ filePath, base64Content, commitMessage }) {
  const { token, owner, repo, branch, isConfigured } = getGitHubConfig();

  if (!isConfigured) {
    throw new Error('GITHUB_TOKEN environment variable is not configured on the server. Please add GITHUB_TOKEN in Vercel Project Settings > Environment Variables.');
  }

  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${filePath}`;
  const headers = getHeaders(token);

  let sha = undefined;
  try {
    const getRes = await fetch(`${url}?ref=${branch}`, { headers });
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }
  } catch (err) {
    console.warn(`Could not fetch existing SHA for ${filePath}:`, err.message);
  }

  const body = {
    message: commitMessage || `chore(media): upload ${filePath}`,
    content: base64Content,
    branch,
  };
  if (sha) body.sha = sha;

  const putRes = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  const resData = await putRes.json().catch(() => ({}));

  if (!putRes.ok) {
    const errorMsg = resData.message || putRes.statusText;
    if (putRes.status === 401) {
      throw new Error('GitHub authentication failed: Bad credentials. Check your GITHUB_TOKEN.');
    }
    if (putRes.status === 403) {
      throw new Error(`GitHub permission denied: ${errorMsg}. Ensure token has 'contents: write' permission.`);
    }
    if (putRes.status === 404) {
      throw new Error(`GitHub repository not found: ${owner}/${repo}. Check GITHUB_OWNER and GITHUB_REPO.`);
    }
    throw new Error(`GitHub API error (${putRes.status}): ${errorMsg}`);
  }

  return {
    success: true,
    sha: resData.commit?.sha,
    url: resData.commit?.html_url,
    path: filePath,
  };
}

/**
 * Atomically commit multiple files (content JSON, JS, images) in a single commit using GitHub Git Data API
 */
export async function commitMultipleFilesToGitHub({ files, commitMessage }) {
  const { token, owner, repo, branch, isConfigured } = getGitHubConfig();

  // Local fallback if no token and running locally in git repository
  const isLocal = !process.env.VERCEL && fs.existsSync(path.join(process.cwd(), '.git'));

  if (!isConfigured) {
    if (isLocal) {
      // Execute via local git CLI
      try {
        execSync('git add -A', { stdio: 'pipe' });
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim()) {
          execSync(`git commit -m "${commitMessage || 'chore(portfolio): publish updates from admin'}"`, { stdio: 'pipe' });
          execSync(`git push origin ${branch}`, { stdio: 'pipe' });
          const headSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
          return {
            success: true,
            method: 'local_git',
            commitSha: headSha,
            commitUrl: `https://github.com/${owner}/${repo}/commit/${headSha}`,
            timestamp: new Date().toISOString(),
            message: 'Committed and pushed to GitHub via local Git! Vercel is deploying now.',
          };
        } else {
          const headSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
          return {
            success: true,
            method: 'local_git_clean',
            commitSha: headSha,
            commitUrl: `https://github.com/${owner}/${repo}/commit/${headSha}`,
            timestamp: new Date().toISOString(),
            message: 'All files are already up-to-date with GitHub.',
          };
        }
      } catch (err) {
        throw new Error(`Local Git error: ${err.message}`);
      }
    } else {
      throw new Error('GITHUB_TOKEN environment variable is not configured. Please add GITHUB_TOKEN to your Vercel Project Settings > Environment Variables.');
    }
  }

  const headers = getHeaders(token);

  // 1. Get branch reference (head commit)
  const refUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/ref/heads/${branch}`;
  const refRes = await fetch(refUrl, { headers });
  if (!refRes.ok) {
    const errData = await refRes.json().catch(() => ({}));
    if (refRes.status === 401) throw new Error('GitHub token invalid: Bad credentials.');
    if (refRes.status === 404) throw new Error(`Branch '${branch}' or repository '${owner}/${repo}' not found.`);
    throw new Error(`Failed to get branch reference: ${errData.message || refRes.statusText}`);
  }
  const refData = await refRes.json();
  const latestCommitSha = refData.object.sha;

  // 2. Get base tree SHA from the latest commit
  const commitUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits/${latestCommitSha}`;
  const commitRes = await fetch(commitUrl, { headers });
  if (!commitRes.ok) throw new Error('Failed to get latest commit tree from GitHub');
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  // 3. Create blobs for each file
  const treeEntries = [];
  for (const file of files) {
    const blobUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/blobs`;
    const blobBody = {
      content: file.content,
      encoding: file.isBase64 ? 'base64' : 'utf-8',
    };

    const blobRes = await fetch(blobUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(blobBody),
    });

    if (!blobRes.ok) {
      const blobErr = await blobRes.json().catch(() => ({}));
      throw new Error(`Failed to create blob for ${file.path}: ${blobErr.message || blobRes.statusText}`);
    }

    const blobData = await blobRes.json();
    treeEntries.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha,
    });
  }

  // 4. Create a new tree with the updated blobs
  const treeUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees`;
  const treeRes = await fetch(treeUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeEntries,
    }),
  });

  if (!treeRes.ok) {
    const treeErr = await treeRes.json().catch(() => ({}));
    throw new Error(`Failed to create Git tree: ${treeErr.message || treeRes.statusText}`);
  }
  const treeData = await treeRes.json();
  const newTreeSha = treeData.sha;

  // Check if anything actually changed
  if (newTreeSha === baseTreeSha) {
    return {
      success: true,
      commitSha: latestCommitSha,
      commitUrl: `https://github.com/${owner}/${repo}/commit/${latestCommitSha}`,
      timestamp: new Date().toISOString(),
      message: 'No changes detected. Content is already up to date on GitHub.',
    };
  }

  // 5. Create a new commit
  const newCommitUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits`;
  const newCommitRes = await fetch(newCommitUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: commitMessage || 'chore(portfolio): publish updates from admin studio',
      tree: newTreeSha,
      parents: [latestCommitSha],
    }),
  });

  if (!newCommitRes.ok) {
    const commitErr = await newCommitRes.json().catch(() => ({}));
    throw new Error(`Failed to create Git commit: ${commitErr.message || newCommitRes.statusText}`);
  }
  const newCommitData = await newCommitRes.json();
  const newCommitSha = newCommitData.sha;

  // 6. Update branch reference to point to new commit
  const updateRefRes = await fetch(refUrl, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      sha: newCommitSha,
      force: false,
    }),
  });

  if (!updateRefRes.ok) {
    const updateErr = await updateRefRes.json().catch(() => ({}));
    throw new Error(`Failed to update branch reference: ${updateErr.message || updateRefRes.statusText}`);
  }

  return {
    success: true,
    method: 'github_rest_api',
    commitSha: newCommitSha,
    commitUrl: `https://github.com/${owner}/${repo}/commit/${newCommitSha}`,
    timestamp: new Date().toISOString(),
    message: 'Successfully committed to GitHub production branch! Vercel is now deploying your changes.',
  };
}
