// migrations/2025XXXXXX-add-eligibility-and-default-rebate-to-products.js
module.exports = {
  up: async (q, S) => {
    await q.addColumn('products', 'eligibilityStart', { type: S.DATEONLY, allowNull: true });
    await q.addColumn('products', 'eligibilityEnd',   { type: S.DATEONLY, allowNull: true });
    await q.addColumn('products', 'defaultRebateCents', { type: S.INTEGER, allowNull: false, defaultValue: 0 });
  },
  down: async (q) => {
    await q.removeColumn('products', 'eligibilityStart');
    await q.removeColumn('products', 'eligibilityEnd');
    await q.removeColumn('products', 'defaultRebateCents');
  }
};
