const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const appController = require('../controllers/applicationController');
const { createApplicationValidation } = require('../validators/applicationValidation');
const appMeasures = require('../controllers/applicationMeasuresController');


router.use(auth);
// Apply authentication middleware to all routes in this file
router.post('/', createApplicationValidation, appController.createDraftApplication);
router.get('/', appController.getApplications);
router.get('/:id', appController.getApplication);
// Update an application by ID
router.put('/:id', appController.updateApplication);
// router.delete('/:id', appController.deleteApplication); // optional
router.post('/draft', appController.createDraftApplication);

// NEW endpoints:
router.post('/:id/measures', appMeasures.postAddMeasure);
router.put('/:id/measures/:measureId', appMeasures.putUpdateMeasureQty);
router.delete('/:id/measures/:measureId', appMeasures.deleteMeasure);

// Replace your old GET /applications/:id handler with this one so it includes measures + total
// router.get('/:id', appMeasures.getApplication);

module.exports = router;
