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

  await ApplicationMeasure.create({
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
  return total || 0;
}

module.exports = { addMeasure };
