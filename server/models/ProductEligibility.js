// models/ProductEligibility.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ProductEligibility extends Model {}

ProductEligibility.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.UUID, allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate:   { type: DataTypes.DATEONLY, allowNull: false },
  // optional: programCode, region, utility, etc.
}, { sequelize, modelName: 'ProductEligibility', tableName: 'product_eligibilities' });

module.exports = ProductEligibility;
