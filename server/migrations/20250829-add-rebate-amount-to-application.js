// Migration: Add rebateAmount to Application

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('applications', 'rebateAmount', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('applications', 'rebateAmount');
  },
};
