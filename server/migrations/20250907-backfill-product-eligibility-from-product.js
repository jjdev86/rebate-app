
module.exports = {
  async up(queryInterface, Sequelize) {
    // If you use gen_random_uuid, ensure pgcrypto is enabled, otherwise switch to uuid_generate_v4()
    await queryInterface.sequelize.query(`
      INSERT INTO "product_eligibilities" ("id", "productId", "startDate", "endDate", "createdAt", "updatedAt")
      SELECT gen_random_uuid(), p."id", p."eligibilityStart", p."eligibilityEnd", NOW(), NOW()
      FROM "products" p
      WHERE p."eligibilityStart" IS NOT NULL
        AND p."eligibilityEnd"   IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM "product_eligibilities" pe
          WHERE pe."productId" = p."id"
            AND pe."startDate" = p."eligibilityStart"
            AND pe."endDate"   = p."eligibilityEnd"
        );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DELETE FROM "product_eligibilities" pe
      USING "products" p
      WHERE pe."productId" = p."id"
        AND pe."startDate" = p."eligibilityStart"
        AND pe."endDate"   = p."eligibilityEnd";
    `);
  }
};
