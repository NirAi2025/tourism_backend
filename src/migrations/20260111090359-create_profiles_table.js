"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("profiles", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    dob: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    nationality: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "countries",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    gender: {
      type: Sequelize.TINYINT,
      allowNull: true,
      comment: "1: male, 2: female, 3: other",
    },
    tour_country_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "countries",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    state_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "states",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    base_city_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "cities",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    languages: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    experience_years: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    hourly_rate: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },

    currency: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    status: {
      type: Sequelize.TINYINT,
      defaultValue: 1,
      comment: "0: pending, 1: active, 2: rejected, 3: banned",
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("profiles");
}
