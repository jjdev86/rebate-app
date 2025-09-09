
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'eligibilityStart');
    await queryInterface.removeColumn('products', 'eligibilityEnd');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'eligibilityStart', { type: Sequelize.DATEONLY, allowNull: true });
    await queryInterface.addColumn('products', 'eligibilityEnd',   { type: Sequelize.DATEONLY, allowNull: true });
  }
};
