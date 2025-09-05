// Migration: Add description, brand, name, and energyStarId to Product

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addColumn('products', 'brand', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addColumn('products', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addColumn('products', 'energyStarId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'description');
    await queryInterface.removeColumn('products', 'brand');
    await queryInterface.removeColumn('products', 'name');
    await queryInterface.removeColumn('products', 'energyStarId');
  },
};
