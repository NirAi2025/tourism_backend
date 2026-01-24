'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  // 1. Add tax_residency_country_id
  await queryInterface.addColumn(
    'guide_payout_accounts',
    'tax_residency_country_id',
    {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'countries',
        key: 'id',
      },
      onDelete: 'SET NULL',
      after: 'payout_currency',
    }
  );

  // 2. Add tax_id
  await queryInterface.addColumn(
    'guide_payout_accounts',
    'tax_id',
    {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'tax_residency_country_id',
      comment: 'PAN / SSN / SIN / TIN',
    }
  );
}

export async function down(queryInterface, Sequelize) {
  // rollback in reverse order
  await queryInterface.removeColumn('guide_payout_accounts', 'tax_id');
  await queryInterface.removeColumn('guide_payout_accounts', 'tax_residency_country_id');
}
