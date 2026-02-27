'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("guide_verifications", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    guide_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    verified_by: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    verification_date: {
      type: Sequelize.DATE,
      defaultValue: null,
      allowNull: true,
    },
    status: {
      type: Sequelize.TINYINT,
      defaultValue: 0, // 0: pending, 1: verified, 2: rejected
      comment: "0: pending, 1: verified, 2: rejected",
    },
    remarks: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("guide_verifications");
}
