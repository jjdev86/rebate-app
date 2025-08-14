const sequelize = require('../config/database');
const User = require('./User');
const Doc = require('./Doc');
const Notification = require('./Notification');

// Define associations if needed
User.hasMany(Doc, { foreignKey: 'userId' });
Doc.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Doc,
  Notification
};
