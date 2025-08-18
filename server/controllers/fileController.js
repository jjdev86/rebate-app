// controllers/fileController.js
const { getPresignedPutUrl, randomKey } = require('../config/s3');
const { Application, ApplicationFile } = require('../models');
const path = require('path');

const BUCKET = process.env.S3_BUCKET;
const PUBLIC_BASE = process.env.S3_PUBLIC_BASE_URL;
const MAX_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '25', 10);
const ALLOWED = [
  'application/pdf',
  'image/png', 'image/jpeg', 'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword'
];

exports.presignUpload = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { filename, contentType, size } = req.body;

    // Basic guards
    if (!filename || !contentType || typeof size !== 'number') {
      return res.status(400).json({ error: 'filename, contentType, size required' });
    }
    if (size > MAX_MB * 1024 * 1024) {
      return res.status(413).json({ error: `Max file size is ${MAX_MB} MB` });
    }
    if (!ALLOWED.includes(contentType)) {
      return res.status(415).json({ error: 'Unsupported file type' });
    }

    // Ensure application belongs to the authed user
    const userId = req.user?.id; // assuming you set req.user from auth middleware
    const app = await Application.findOne({ where: { id: applicationId, userId } });
    if (!app) return res.status(404).json({ error: 'Application not found' });

    const ext = path.extname(filename) || '';
    const key = `applications/${applicationId}/${randomKey('file_')}${ext}`;

    const uploadUrl = await getPresignedPutUrl({
      bucket: BUCKET,
      key,
      contentType,
      expiresIn: 60 // seconds
    });

    // Where the file will be publicly accessible if you proxy it; for now store S3 path.
    const publicUrl = `${PUBLIC_BASE}/${key}`;

    return res.json({ uploadUrl, key, publicUrl });
  } catch (err) {
    next(err);
  }
};

exports.createApplicationFile = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { key, url, filename, contentType, size } = req.body;

    if (!key || !filename || !contentType || typeof size !== 'number') {
      return res.status(400).json({ error: 'key, filename, contentType, size required' });
    }

    // Verify application ownership again
    const userId = req.user?.id;
    const app = await Application.findOne({ where: { id: applicationId, userId } });
    if (!app) return res.status(404).json({ error: 'Application not found' });

    const record = await ApplicationFile.create({
      applicationId,
      key,
      url: url || `${PUBLIC_BASE}/${key}`,
      filename,
      contentType,
      sizeBytes: size
    });

    return res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

exports.listApplicationFiles = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user?.id;

    const app = await Application.findOne({ where: { id: applicationId, userId } });
    if (!app) return res.status(404).json({ error: 'Application not found' });

    const files = await ApplicationFile.findAll({
      where: { applicationId },
      order: [['createdAt', 'DESC']]
    });

    res.json(files);
  } catch (err) {
    next(err);
  }
};

exports.deleteApplicationFile = async (req, res, next) => {
  try {
    const { applicationId, fileId } = req.params;
    const userId = req.user?.id;

    const app = await Application.findOne({ where: { id: applicationId, userId } });
    if (!app) return res.status(404).json({ error: 'Application not found' });

    const rec = await ApplicationFile.findOne({ where: { id: fileId, applicationId } });
    if (!rec) return res.status(404).json({ error: 'File not found' });

    // Soft delete DB row; optional: also delete from S3 async (can add a queue)
    await rec.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
