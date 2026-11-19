import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { file } = req.query;
  const filename = Array.isArray(file) ? file.join('/') : file;

  // Check in src/media first, then public/media
  let filePath = path.join(process.cwd(), 'src', 'media', filename);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), 'public', 'media', filename);
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Not found');
  }

  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=86400');

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}
