// routes/applicationFiles.js
const express = require('express');
const { body } = require('express-validator');
const {
  presignUpload,
  createApplicationFile,
  listApplicationFiles,
  deleteApplicationFile
} = require('../controllers/fileController');
const validate = require('../middleware/validate'); // your express-validator result handler
const requireAuth = require('../middleware/requireAuth'); // sets req.user

const router = express.Router({ mergeParams: true });

router.use(requireAuth);

// GET /api/applications/:applicationId/files
router.get('/', listApplicationFiles);

// POST /api/applications/:applicationId/files/presign
router.post(
  '/presign',
  [
    body('filename').isString().notEmpty(),
    body('contentType').isString().notEmpty(),
    body('size').isInt({ min: 1 })
  ],
  validate,
  presignUpload
);

// POST /api/applications/:applicationId/files (create DB row after successful S3 PUT)
router.post(
  '/',
  [
    body('key').isString().notEmpty(),
    body('filename').isString().notEmpty(),
    body('contentType').isString().notEmpty(),
    body('size').isInt({ min: 1 }),
    body('url').optional().isString()
  ],
  validate,
  createApplicationFile
);

// DELETE /api/applications/:applicationId/files/:fileId
router.delete('/:fileId', deleteApplicationFile);

module.exports = router;
