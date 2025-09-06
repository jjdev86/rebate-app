// migrations/20250905-create-application-measures.js
module.exports = {
  up: async (q, S) => {
    await q.createTable('application_measures', {
      id: { type: S.UUID, defaultValue: S.UUIDV4, primaryKey: true },
      applicationId: { type: S.UUID, allowNull: false, references: { model: 'applications', key: 'id' } },
      productId:     { type: S.UUID, allowNull: true,  references: { model: 'products', key: 'id' } },
      productType:   { type: S.STRING, allowNull: false },
      productName:   { type: S.STRING },
      qty:           { type: S.INTEGER, allowNull: false, defaultValue: 1 },
      unitRebateCents:{ type: S.INTEGER, allowNull: false, defaultValue: 0 },
      lineRebateCents:{ type: S.INTEGER, allowNull: false, defaultValue: 0 },
      resolvedSource:{ type: S.STRING },
      createdAt:     { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updatedAt:     { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });
    await q.addIndex('application_measures', ['applicationId']);
  },
  down: (q) => q.dropTable('application_measures')
};
