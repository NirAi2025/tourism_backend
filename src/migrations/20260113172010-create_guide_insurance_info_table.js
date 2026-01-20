"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("guide_insurances", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    guide_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    // Insurance
    insurance_provider: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    policy_number: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    policy_expiry_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    insurance_document: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: " Coverage for guests (PDF or image)",
    },

    emergency_contact_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    emergency_contact_phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    emergency_contact_relation: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "wife, brother, friend etc",
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
  await queryInterface.dropTable("guide_insurances");
}
