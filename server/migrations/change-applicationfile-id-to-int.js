// migrations/XXXX-change-applicationfile-id-to-int.js
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the old id column
    await queryInterface.removeColumn('application_files', 'id');

    // Add new integer autoincrement PK
    await queryInterface.addColumn('application_files', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: drop int id and re-add UUID
    await queryInterface.removeColumn('application_files', 'id');
    await queryInterface.addColumn('application_files', 'id', {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      primaryKey: true
    });
  }
};
// This migration changes the primary key of ApplicationFile from UUID to an auto-incrementing integer.