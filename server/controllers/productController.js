const { Product } = require("../models");

exports.getProducts = async (req, res) => {
  const products = await Product.findAll();

  const equipmentTypes = [...new Set(products.map((p) => p.type))];
  const models = products.map((p) => p.modelNumber);

  // You can hardcode efficiency ratings here
  const efficiencyRatings = ["SEER 15", "SEER 16", "SEER 17"];

  res.json({ equipmentTypes, models, efficiencyRatings });
};
