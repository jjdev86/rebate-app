const sequelize = require('../config/database');
const User = require('./User');
const Doc = require('./Doc');
const Notification = require('./Notification');
const Product = require('./Product');
const Application = require('./Application');
const ApplicationFile = require('./ApplicationFile');
const ApplicationMeasure = require('./ApplicationMeasure');



// Define associations - Documents
User.hasMany(Doc, { foreignKey: 'userId' });
Doc.belongsTo(User, { foreignKey: 'userId' });
// Define associations - Notifications
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// Define associations - Applications ↔ Users & Products
Application.belongsTo(User, { foreignKey: "userId" });
Application.belongsTo(Product, { foreignKey: "productId" });

// Define associations - Applications ↔ Users & Products
User.hasMany(Application, { foreignKey: "userId" });
Product.hasMany(Application, { foreignKey: "productId" });

// Associations with ApplicationFile
ApplicationFile.belongsTo(Application, { foreignKey: 'applicationId' });
Application.hasMany(ApplicationFile,   { foreignKey: 'applicationId', as: 'files' });

// Applications ↔ Measures (NEW)
Application.hasMany(ApplicationMeasure, {
  foreignKey: 'applicationId',
  as: 'measures',
  onDelete: 'CASCADE',
});

ApplicationMeasure.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });

// Products ↔ Measures
Product.hasMany(ApplicationMeasure, { foreignKey: 'productId', as: 'measures' });
ApplicationMeasure.belongsTo(Product,   { foreignKey: 'productId', as: 'product' });

module.exports = {
  sequelize,
  User,
  Doc,
  Notification,
  Product,
  Application,
  ApplicationFile,
  ApplicationMeasure
};
