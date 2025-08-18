const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const appController = require('../controllers/applicationController');
const { createApplicationValidation } = require('../middleware/validators/applicationValidation');

router.use(auth);
// Apply authentication middleware to all routes in this file
router.post('/', createApplicationValidation, appController.createApplication);
router.get('/', appController.getApplications);
router.get('/:id', appController.getApplication);
// router.put('/:id', appController.updateApplication);   // add later
// router.delete('/:id', appController.deleteApplication); // optional

module.exports = router;
