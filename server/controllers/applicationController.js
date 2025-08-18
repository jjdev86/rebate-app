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
      { model: Product, attributes: ['id', 'type', 'modelNumber'] },
    ],
  });
  if (!app) return res.status(404).json({ message: 'Not found' });
  res.json(app);
};
