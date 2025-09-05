const { Application, ApplicationFile, Product } = require('../models');
const { validationResult } = require('express-validator');

exports.createApplication = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const {
      customerFirstName,
      customerLastName,
      installAddress,
      email,
      phoneNumber,
      productId,
      notes,
    } = req.body;

    // ensure product exists
    const product = await Product.findByPk(productId);
    if (!product) return res.status(400).json({ message: 'Invalid productId' });

    const app = await Application.create({
      userId: req.user.id,
      customerFirstName,
      customerLastName,
      installAddress,
      email,
      phoneNumber,
      productId,
      status: 'submitted', // or 'draft' depending on your flow
      notes,
    });

    res.status(201).json(app);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.createDraftApplication = async (req, res) => {
  try {
    const app = await Application.create({
      userId: req.user.id,
      status: 'draft',
    });
    res.status(201).json({ id: app.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getApplications = async (req, res) => {
  const apps = await Application.findAll({
    where: { userId: req.user.id },
    include: [{ model: ApplicationFile, as: 'files', attributes: ['id', 'url', 'filename'] }],
    order: [['createdAt', 'DESC']],
  });
  res.json(apps);
};

exports.getApplication = async (req, res) => {
  const app = await Application.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [
      { model: ApplicationFile, as: 'files', attributes: ['id', 'url', 'filename', 'mimeType', 'sizeBytes'] },
      { model: Product, attributes: ['id', 'type', 'modelNumber', 'description', 'brand', 'energyStarId'] },
    ],
  });
  if (!app) return res.status(404).json({ message: 'Not found' });

  // Standardize: flatten product fields to top-level
  let appJson = app.toJSON();
  if (appJson.Product) {
    appJson.productId = appJson.Product.id;
    appJson.brand = appJson.Product.brand;
    appJson.model = appJson.Product.modelNumber;
    appJson.modelNumber = appJson.Product.modelNumber;
    // Standardize: equipmentType is always the product description (display label)
    appJson.equipmentType = appJson.Product.description;
    appJson.type = appJson.Product.type;
    appJson.description = appJson.Product.description;
    appJson.energyStarId = appJson.Product.energyStarId;
    // Add equipmentType to the Product object for consistency
    appJson.Product.equipmentType = appJson.Product.description;
    appJson.product = appJson.Product;
  }
  res.json(appJson);
};

exports.updateApplication = async (req, res) => {
  try {
    const app = await Application.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!app) return res.status(404).json({ message: 'Not found' });
    await app.update(req.body);
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
