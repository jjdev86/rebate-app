const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const appController = require('../controllers/applicationController');
const { createApplicationValidation } = require('../validators/applicationValidation');

router.use(auth);
// Apply authentication middleware to all routes in this file
router.post('/', createApplicationValidation, appController.createApplication);
router.get('/', appController.getApplications);
router.get('/:id', appController.getApplication);
// Update an application by ID
router.put('/:id', appController.updateApplication);
// router.delete('/:id', appController.deleteApplication); // optional
router.post('/draft', appController.createDraftApplication);

module.exports = router;
