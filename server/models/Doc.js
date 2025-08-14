const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Doc extends Model {}

Doc.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: true },
  userId: { type: DataTypes.UUID, allowNull: false },
}, {
  sequelize,
  modelName: 'Doc',
  tableName: 'docs',
  timestamps: true,
});

module.exports = Doc;
// This file defines the Doc model using Sequelize with fields for id, title, content, and userId.