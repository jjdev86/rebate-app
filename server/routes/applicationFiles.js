// routes/applicationFiles.js
const express = require('express');
const {
  presignUpload,
  createApplicationFile,
  listApplicationFiles,
  deleteApplicationFile
} = require('../controllers/fileController');
const validate = require('../middleware/fileValidate');
const requireAuth = require('../middleware/authMiddleware');

const {
  presignUploadRules,
  createFileRules,
  listFilesRules,
  deleteFileRules
} = require('../validators/applicationFileValidation');

const router = express.Router({ mergeParams: true });

router.use(requireAuth);

// GET /api/applications/:applicationId/files
router.get('/', listFilesRules, validate, listApplicationFiles);

// POST /api/applications/:applicationId/files/presign
router.post('/presign', presignUploadRules, validate, presignUpload);

// POST /api/applications/:applicationId/files
router.post('/', createFileRules, validate, createApplicationFile);

// DELETE /api/applications/:applicationId/files/:fileId
router.delete('/:fileId', deleteFileRules, validate, deleteApplicationFile);

module.exports = router;
// This file defines routes for handling application files, including listing, uploading, and deleting files.