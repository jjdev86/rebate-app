const { Product } = require("../models");

exports.getProducts = async (req, res) => {
  const products = await Product.findAll();

  const equipmentTypes = [...new Set(products.map((p) => p.description))];
  const models = products.map((p) => ({
    id: p.id,
    type: p.type,
    modelNumber: p.modelNumber,
    description: p.description,
    brand: p.brand,
    energyStarId: p.energyStarId,
  }));

  // You can hardcode efficiency ratings here
  const efficiencyRatings = ["SEER 15", "SEER 16", "SEER 17"];

  res.json({ equipmentTypes, models, efficiencyRatings });
};
