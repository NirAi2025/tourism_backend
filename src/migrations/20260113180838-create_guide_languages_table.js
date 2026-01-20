"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("guide_languages", {
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

    language: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    is_primary: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
  await queryInterface.dropTable("guide_languages");
}
