const express = require('express');
const router = express.Router();
const docsController = require('../controllers/docsController');
const authMiddleware = require('../middleware/authMiddleware');
const { docValidation } = require('../utils/validators');

router.use(authMiddleware);

router.get('/', docsController.getAllDocs);
router.get('/:id', docsController.getDoc);
router.post('/', docValidation, docsController.createDoc);
router.put('/:id', docValidation, docsController.updateDoc);
router.delete('/:id', docsController.deleteDoc);

module.exports = router;
// This file defines the routes for document management, including fetching all documents, getting a specific document by ID,
 