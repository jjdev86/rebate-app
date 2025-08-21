// validators/applicationFiles.validators.js
const { body, param } = require('express-validator');
const { MAX_FILE_SIZE_MB, ALLOWED_MIME } = require('../config/fileContraints');

const applicationIdParam = [
  param('applicationId')
    .exists().withMessage('applicationId param is required')
    .isUUID(4).withMessage('applicationId must be a UUID v4')
];

const fileIdParam = [
  // fileId is an integer ID in the database
  param('fileId').toInt().isInt({ min: 1 }).withMessage('fileId must be a positive integer')
];

// Common field rules
const filenameRule = body('filename')
  .exists().withMessage('filename is required')
  .isString().withMessage('filename must be a string')
  .trim()
  .isLength({ min: 1, max: 255 }).withMessage('filename must be 1-255 chars')
  // forbid path separators so users can’t smuggle paths
  .custom(v => !(/[\\/]/.test(v))).withMessage('filename cannot contain path separators');

const contentTypeRule = body('contentType')
  .exists().withMessage('contentType is required')
  .isString().withMessage('contentType must be a string')
  .trim()
  .custom(v => ALLOWED_MIME.includes(v)).withMessage(`contentType not allowed`);

const sizeRule = body('size')
  .exists().withMessage('size is required')
  .toInt()
  .isInt({ min: 1 }).withMessage('size must be a positive integer (bytes)')
  .custom(bytes => bytes <= MAX_FILE_SIZE_MB * 1024 * 1024)
  .withMessage(`size exceeds limit of ${MAX_FILE_SIZE_MB} MB`);

const s3KeyRule = body('s3Key')
  .exists().withMessage('s3Key is required')
  .isString().withMessage('s3Key must be a string')
  .trim()
  .isLength({ min: 10, max: 2048 }).withMessage('s3Key length looks invalid')
  // basic “S3 object key hygiene”: no control chars, no leading slash
  .custom(v => !(/^\//.test(v))).withMessage('s3Key must not start with "/"')
  .custom(v => !(/[\x00-\x1F]/.test(v))).withMessage('s3Key contains invalid characters')
  // ensure it’s under applications/<id>/...
  .custom((v, { req }) => {
    const id = String(req.params.applicationId || '');
    return v.startsWith(`applications/${id}/`);
  }).withMessage('key must be under applications/:applicationId/');

const optionalUrlRule = body('url')
  .optional()
  .isString().withMessage('url must be a string')
  .trim()
  .isLength({ max: 2048 }).withMessage('url too long');

// --- Exported rule sets ---

// POST /api/applications/:applicationId/files/presign
const presignUploadRules = [
  ...applicationIdParam,
  filenameRule,
  contentTypeRule,
  sizeRule
];

// POST /api/applications/:applicationId/files
const createFileRules = [
  ...applicationIdParam,
  s3KeyRule,
  filenameRule,
  contentTypeRule,
  sizeRule,
  optionalUrlRule
];

// GET /api/applications/:applicationId/files
const listFilesRules = [
  ...applicationIdParam
];

// DELETE /api/applications/:applicationId/files/:fileId
const deleteFileRules = [
  ...applicationIdParam,
  ...fileIdParam
];

module.exports = {
  presignUploadRules,
  createFileRules,
  listFilesRules,
  deleteFileRules
};
