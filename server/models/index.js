const sequelize = require('../config/database');
const User = require('./User');
const Doc = require('./Doc');
const Notification = require('./Notification');
const Product = require('./Product');
const Application = require('./Application');
const ApplicationFile = require('./ApplicationFile');

// Define associations if needed
User.hasMany(Doc, { foreignKey: 'userId' });
Doc.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Doc,
  Notification,
  Product,
  Application,
  ApplicationFile
};
