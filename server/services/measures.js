// services/measures.js
const { Application, ApplicationMeasure, Product } = require('../models');

function eligible(product, asOf = new Date()) {
  const s = product.eligibilityStart ? new Date(product.eligibilityStart) : null;
  const e = product.eligibilityEnd   ? new Date(product.eligibilityEnd)   : null;
  return (!s || asOf >= s) && (!e || asOf <= e);
}

async function addMeasure({ applicationId, productId, qty = 1 }) {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');
  if (!eligible(product)) throw new Error('Product not eligible at this time');

  const unit = product.defaultRebateCents || 0;
  const line = unit * qty;

  const measure = await ApplicationMeasure.create({
    applicationId,
    productId,
    productType: product.type,       // 'HPWH' | 'ST'
    productName: product.name,       // optional convenience
    qty,
    unitRebateCents: unit,
    lineRebateCents: line,
    resolvedSource: 'product.default',
  });

  const total = await ApplicationMeasure.sum('lineRebateCents', { where: { applicationId } });
  await Application.update({ totalRebateCents: total || 0 }, { where: { id: applicationId } });
  return { measure, totalRebateCents: total || 0 };
}

async function updateMeasureQty({ applicationId, measureId, qty }) {
  const measure = await ApplicationMeasure.findOne({ where: { id: measureId, applicationId } });
  if (!measure) throw new Error('Measure not found');
  if (qty < 1) throw new Error('Quantity must be at least 1');
  const product = await Product.findByPk(measure.productId);
  if (!product) throw new Error('Product not found');
  const unit = product.defaultRebateCents || 0;
  const line = unit * qty;
  await measure.update({ qty, unitRebateCents: unit, lineRebateCents: line });
  const total = await ApplicationMeasure.sum('lineRebateCents', { where: { applicationId } });
  await Application.update({ totalRebateCents: total || 0 }, { where: { id: applicationId } });
  return { measure, totalRebateCents: total || 0 };
}

async function removeMeasure({ applicationId, measureId }) {
  const measure = await ApplicationMeasure.findOne({ where: { id: measureId, applicationId } });
  if (!measure) throw new Error('Measure not found');
  await measure.destroy();
  const total = await ApplicationMeasure.sum('lineRebateCents', { where: { applicationId } });
  await Application.update({ totalRebateCents: total || 0 }, { where: { id: applicationId } });
  return { totalRebateCents: total || 0 };
}

async function getApplicationWithMeasures(applicationId) {
  const app = await Application.findByPk(applicationId, {
    include: [
      {
        model: ApplicationMeasure,
        as: 'measures',
        include: [
          { model: Product, as: 'product' }
        ]
      }
    ]
  });
  if (!app) throw new Error('Application not found');
  return app;
}

module.exports = { addMeasure, updateMeasureQty, removeMeasure, getApplicationWithMeasures };
