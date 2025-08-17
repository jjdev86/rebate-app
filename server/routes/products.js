const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

//application.js
// Get application product options
router.get('/application-options', productController.getProducts);

module.exports = router;
// This file defines the configuration routes for fetching application options like equipment types, models, and efficiency ratings.
