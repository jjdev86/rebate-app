
// controllers/fileController.js
const { getPresignedPutUrl, randomKey } = require("../config/s3");
const { Application, ApplicationFile } = require("../models");
const path = require("path");

const BUCKET = process.env.S3_BUCKET;
const PUBLIC_BASE = process.env.S3_PUBLIC_BASE_URL;

const MAX_MB = parseInt(process.env.MAX_FILE_SIZE_MB || "25", 10);
const ALLOWED = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, rej) =>
      setTimeout(() => rej(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}


// Returns a presigned GET URL for a file (for secure viewing)
exports.presignGetUrl = async (req, res, next) => {
  try {
    const { applicationId, fileId } = req.params;
    const userId = req.user?.id;
    // Find the file and check ownership
    const file = await ApplicationFile.findOne({
      where: { id: fileId, applicationId },
      include: [{ model: Application, where: { userId } }]
    });
    if (!file) return res.status(404).json({ error: 'File not found' });
    const { getPresignedGetUrl } = require('../config/s3');
    const url = await getPresignedGetUrl({ key: file.s3Key, expiresIn: 60 });
    return res.json({ url });
  } catch (err) {
    console.error('presignGetUrl error', { err });
    next(err);
  }
};

exports.presignUpload = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { filename, contentType, size } = req.body;

    // 🔒 Require auth:
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: user context missing" });
    }
    const userId = req.user.id;

    // Basic input checks (your express-validator should already ensure these)
    if (!filename || !contentType || typeof size !== "number") {
      return res
        .status(400)
        .json({ error: "filename, contentType, size required" });
    }

    // Verify application ownership
    const app = await Application.findOne({
      where: { id: applicationId, userId },
    });
    if (!app) {
      return res
        .status(404)
        .json({ error: "Application not found or not owned by user" });
    }

    // ... generate key, get presigned URL, respond ...
    // Generate key under applications/:applicationId/
    const ext = path.extname(filename) || "";
    const key = `applications/${applicationId}/${randomKey("file_")}${ext}`;
    // Presign S3 PUT
    const tS3 = Date.now();
    const uploadUrl = await withTimeout(
      getPresignedPutUrl({
        bucket: process.env.S3_BUCKET,
        key,
        contentType,
        expiresIn: 60, // seconds
      }),
      6000,
      "S3 presign"
    );
    // console.log('S3 presign ms:', Date.now() - tS3);

    const publicUrl = `${process.env.S3_PUBLIC_BASE_URL}/${key}`;
    // console.log('Total presign handler ms:', Date.now() - t0);

    return res.json({ uploadUrl, s3Key: key, publicUrl });
  } catch (err) {
    // Add a bit of context to the server logs
    console.error("presignUpload error", {
      userPresent: !!req.user,
      userId: req.user?.id,
      applicationId: req.params?.applicationId,
      err,
    });
    next(err);
  }
};

exports.createApplicationFile = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { s3Key, url, filename, contentType, size } = req.body;

    if (!s3Key || !filename || !contentType || typeof size !== "number") {
      return res
        .status(400)
        .json({ error: "s3Key, filename, contentType, size required" });
    }

    // Verify application ownership again
    const userId = req.user?.id;
    const app = await Application.findOne({
      where: { id: applicationId, userId },
    });
    if (!app) return res.status(404).json({ error: "Application not found" });
    // bug fix
    console.log("Creating ApplicationFile with payload:", {
      applicationId,
      s3Key,
      url,
      filename,
      contentType,
      size: req.body.size,
      sizeBytes: req.body.sizeBytes,
    });

    const record = await ApplicationFile.create({
      applicationId,
      s3Key,
      url: url || `${PUBLIC_BASE}/${s3Key}`,
      filename,
      contentType,
      sizeBytes: size,
    });

    return res.status(201).json(record);
  } catch (err) {
    console.error('ApplicationFile.create failed:', err);
    next(err);
  }
};

exports.listApplicationFiles = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user?.id;

    const app = await Application.findOne({
      where: { id: applicationId, userId },
    });
    if (!app) return res.status(404).json({ error: "Application not found" });

    const files = await ApplicationFile.findAll({
      where: { applicationId },
      order: [["createdAt", "DESC"]],
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
   
    const app = await Application.findOne({
      where: { id: applicationId, userId },
    });
    if (!app) return res.status(404).json({ error: "Application not found" });

    const rec = await ApplicationFile.findOne({
      where: { id: fileId, applicationId },
    });
    if (!rec) return res.status(404).json({ error: "File not found" });

    /// Idempotent soft-delete: if already deleted, still return 204
    if (!rec.isDeleted) {
      await rec.update({ isDeleted: true });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
// This file handles file uploads for applications, including presigning S3 URLs and managing application files.
