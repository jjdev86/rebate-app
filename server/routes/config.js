const express = require('express');
const router = express.Router();
const { Product } = require('../models');

router.get('/application-options', async (req, res) => {
  const products = await Product.findAll();

  const equipmentTypes = [...new Set(products.map(p => p.type))];
  const models = products.map((p) => p.modelNumber);

  // You can hardcode efficiency ratings here
  const efficiencyRatings = ['SEER 15', 'SEER 16', 'SEER 17'];

  res.json({ equipmentTypes, models, efficiencyRatings });
});

module.exports = router;
// This file defines the configuration routes for fetching application options like equipment types, models, and efficiency ratings.