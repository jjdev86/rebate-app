// server/models/ApplicationMeasure.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ApplicationMeasure extends Model {}

ApplicationMeasure.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

  applicationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'applications', key: 'id' },
  },

  productId: {
    type: DataTypes.UUID,
    allowNull: true, 
    references: { model: 'products', key: 'id' },
  },


  productType: { type: DataTypes.STRING, allowNull: false },   // e.g., 'HPWH' | 'ST'
  productName: { type: DataTypes.STRING, allowNull: true },    // optional convenience

  qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },

  // Store money as integer cents for correctness
  unitRebateCents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  lineRebateCents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

  // optional: traceability
  resolvedSource: { type: DataTypes.STRING, allowNull: true }, // 'product.default' | 'type.default'
}, {
  sequelize,
  modelName: 'ApplicationMeasure',
  tableName: 'application_measures',
  timestamps: true,
});

module.exports = ApplicationMeasure;
