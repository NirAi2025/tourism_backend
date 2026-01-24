'use strict';

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
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },

    certification_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    issuing_organization: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    issue_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    expiration_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    certificate_file: {
      type: Sequelize.STRING,
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
  await queryInterface.dropTable("guide_certifications");
}
