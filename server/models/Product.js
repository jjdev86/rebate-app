module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modelNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Product;
};
// This code defines a Sequelize model for a Product with fields for id, type, and modelNumber.