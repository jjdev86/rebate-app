// services/measures.js
const {
  Application,
  ApplicationMeasure,
  Product,
  ProductEligibility,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

async function eligible(productOrId, asOf = new Date()) {
  const productId =
    typeof productOrId === "string" ? productOrId : productOrId?.id;

  if (!productId) {
    throw new TypeError(
      "eligible(productOrId) requires a product ID or Product with an id"
    );
  }
  const d = asOf.toISOString().slice(0, 10); // DATEONLY compare
  const count = await ProductEligibility.count({
    where: {
      productId,
      startDate: { [require("sequelize").Op.lte]: d },
      endDate: { [require("sequelize").Op.gte]: d },
    },
  });
  return count > 0;
}

async function addMeasure({ applicationId, productId, qty = 1 }) {
  return await sequelize.transaction(async (t) => {
    // 1) Validate product & eligibility (unchanged)
    const product = await Product.findByPk(productId, { transaction: t });
    if (!product) throw new Error("Product not found");
    if (!eligible(product))
      throw new Error("Product not eligible at this time");

    // 2) Check for existing row
    const existing = await ApplicationMeasure.findOne({
      where: { applicationId, productId },
      transaction: t,
    });

    let measure;
    let created = false;

    if (existing) {
      // Do NOT increment qty — idempotent behavior
      measure = existing;
    } else {
      // Create new row
      const unit = product.defaultRebateCents || 0;
      const line = unit * qty;

      measure = await ApplicationMeasure.create(
        {
          applicationId,
          productId,
          productType: product.type,
          productName: product.name,
          qty,
          unitRebateCents: unit,
          lineRebateCents: line,
          resolvedSource: "product.default",
        },
        { transaction: t }
      );

      created = true;
    }

    const total = await ApplicationMeasure.sum("lineRebateCents", {
      where: { applicationId },
      transaction: t,
    });
    await Application.update(
      { totalRebateCents: total || 0 },
      { where: { id: applicationId }, transaction: t }
    );

    return { measure, totalRebateCents: total || 0, created };
  });
}

async function updateMeasureQty({ applicationId, measureId, qty }) {
  const measure = await ApplicationMeasure.findOne({
    where: { id: measureId, applicationId },
  });
  if (!measure) throw new Error("Measure not found");
  if (qty < 1) throw new Error("Quantity must be at least 1");
  const product = await Product.findByPk(measure.productId);
  if (!product) throw new Error("Product not found");
  const unit = product.defaultRebateCents || 0;
  const line = unit * qty;
  await measure.update({ qty, unitRebateCents: unit, lineRebateCents: line });

  const app = await Application.findByPk(applicationId, {
    attributes: ["totalRebateCents"],
  });

  return { measure, totalRebateCents: app.totalRebateCents || 0 };
}

async function removeMeasure({ applicationId, measureId }) {
  const measure = await ApplicationMeasure.findOne({
    where: { id: measureId, applicationId },
  });
  if (!measure) throw new Error("Measure not found");
  await measure.destroy();

  const app = await Application.findByPk(applicationId, {
    attributes: ["totalRebateCents"],
  });

  return { measure, totalRebateCents: app.totalRebateCents || 0 };
}

async function getApplicationWithMeasures(applicationId) {
  const app = await Application.findByPk(applicationId, {
    include: [
      {
        model: ApplicationMeasure,
        as: "measures",
        include: [{ model: Product, as: "product" }],
      },
    ],
  });
  if (!app) throw new Error("Application not found");
  return app;
}

module.exports = {
  addMeasure,
  updateMeasureQty,
  removeMeasure,
  getApplicationWithMeasures,
};
