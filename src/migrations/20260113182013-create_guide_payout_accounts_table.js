'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("guide_payout_accounts", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    guide_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },

    account_holder_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    bank_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    account_number: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Account number or IBAN",
    },

    routing_code: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "IFSC / SWIFT / BIC",
    },

    payout_currency: {
      type: Sequelize.STRING(4),
      allowNull: true,
      comment: "ISO currency code like USD, INR",
    },

    payout_method: {
      type: Sequelize.ENUM("bank_transfer", "paypal"),
      allowNull: true,
    },

    is_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    verified_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },

    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("guide_payout_accounts");
}
