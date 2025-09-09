module.exports = {
  async up(queryInterface, Sequelize) {
    // Safely remove index if it exists
    await queryInterface.removeIndex('applications', ['productId']).catch(() => {});
    // Drop the column
    await queryInterface.removeColumn('applications', 'productId');
  },

  async down(queryInterface, Sequelize) {
    // Re-add column (nullable to be safe)
    await queryInterface.addColumn('applications', 'productId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'products', key: 'id' },
    });
    await queryInterface.addIndex('applications', ['productId']);
  }
};
