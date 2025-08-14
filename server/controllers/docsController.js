const { validationResult } = require('express-validator');
const { Doc } = require('../models');

exports.getAllDocs = async (req, res) => {
  try {
    const docs = await Doc.findAll({ where: { userId: req.user.id } });
    res.json(docs);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.getDoc = async (req, res) => {
  try {
    const doc = await Doc.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!doc) return res.status(404).json({ message: 'Doc not found' });
    res.json(doc);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.createDoc = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const doc = await Doc.create({ ...req.body, userId: req.user.id });
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.updateDoc = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    let doc = await Doc.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!doc) return res.status(404).json({ message: 'Doc not found' });

    await doc.update(req.body);
    res.json(doc);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.deleteDoc = async (req, res) => {
  try {
    const doc = await Doc.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!doc) return res.status(404).json({ message: 'Doc not found' });

    await doc.destroy();
    res.json({ message: 'Doc deleted' });
  } catch (error) {
    res.status(500).send('Server error');
  }
};
// This file defines the routes for document management, including fetching all documents, getting a specific document by ID,
// creating a new document, updating an existing document, and deleting a document.