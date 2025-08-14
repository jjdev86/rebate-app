const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Notification extends Model {}

Notification.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  message: { type: DataTypes.STRING, allowNull: false },
  read: { type: DataTypes.BOOLEAN, defaultValue: false },
  userId: { type: DataTypes.UUID, allowNull: false },
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'notifications',
  timestamps: true,
});

module.exports = Notification;
// This file defines the Notification model using Sequelize with fields for id, message, read status, and userId.
// It establishes a one-to-many relationship with the User model, where each notification belongs to a