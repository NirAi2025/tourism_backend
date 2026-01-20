"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("guide_certifications", {
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

    certification_type: {
      type: Sequelize.ENUM("first_aid", "safety_training", "other"),
      allowNull: true,
    },

    certificate_file: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    expiry_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    verification_status: {
      type: Sequelize.TINYINT,
      allowNull: true,
    },

    rejection_reason: {
      type: Sequelize.STRING,
      allowNull: true,
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
export async function down(queryInterface) {
  await queryInterface.dropTable("guide_certifications");
}
