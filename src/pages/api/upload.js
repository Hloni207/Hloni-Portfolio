import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, base64Data } = req.body;
    if (!name || !base64Data) {
      return res.status(400).json({ error: 'Missing name or base64Data' });
    }

    // Clean filename
    const sanitizedName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${Date.now()}_${sanitizedName}`;

    // Extract base64 content
    const base64Content = base64Data.replace(/^data:[a-zA-Z0-9/+.-]+;base64,/, '');
    const buffer = Buffer.from(base64Content, 'base64');

    // Target directories: src/media and public/media
    const srcMediaDir = path.join(process.cwd(), 'src', 'media');
    const publicMediaDir = path.join(process.cwd(), 'public', 'media');

    if (!fs.existsSync(srcMediaDir)) {
      fs.mkdirSync(srcMediaDir, { recursive: true });
    }
    if (!fs.existsSync(publicMediaDir)) {
      fs.mkdirSync(publicMediaDir, { recursive: true });
    }

    fs.writeFileSync(path.join(srcMediaDir, fileName), buffer);
    fs.writeFileSync(path.join(publicMediaDir, fileName), buffer);

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
