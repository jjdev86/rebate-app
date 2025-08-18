const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

class Application extends Model {}

Application.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // Customer fields (per your spec)
    customerFirstName: { type: DataTypes.STRING, allowNull: false },
    customerLastName:  { type: DataTypes.STRING, allowNull: false },
    installAddress:    { type: DataTypes.STRING, allowNull: false },
    email:             { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
    phoneNumber:       { type: DataTypes.STRING, allowNull: true,  validate: { is: /^[0-9\-\+\s\(\)]*$/i } },

    // Link to product (Heat Pump Water Heater / Thermostats)
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'products', key: 'id' },
    },

    // Workflow
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected'),
      defaultValue: 'draft',
    },

    // Optional: any freeform notes
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Application',
    tableName: 'applications',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['productId'] },
      { fields: ['status'] },
    ],
  }
);

// Associations (define after init)
Application.belongsTo(User,   { foreignKey: 'userId'   });
Application.belongsTo(Product,{ foreignKey: 'productId' });

User.hasMany(Application,     { foreignKey: 'userId'   });
Product.hasMany(Application,  { foreignKey: 'productId' });

module.exports = Application;
