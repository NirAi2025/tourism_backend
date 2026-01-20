"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("guide_public_profiles", {
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

    bio: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    profile_photo: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    cover_photo: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    google_review_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    tripadvisor_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    instagram_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    linkedin_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    is_profile_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
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
  await queryInterface.dropTable("guide_public_profiles");
}
