"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("guide_licenses", {
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
      onDelete: "SET NULL",
    },

    license_type: {
      type: Sequelize.ENUM(
        "licensed_tour_guide",
        "tourism_department_id",
        "local_guide_permit",
        "special_activity_license"
      ),
      allowNull: true,
      comment: "Type of tourism permit",
    },

    license_number: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    issued_by: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Tourism department / local authority",
    },

    city_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      comment: "Required for local permits",
    },

    activity_type: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "trekking, diving, boating, safari etc",
    },

    document_file: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    expiry_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    verification_status: {
      type: Sequelize.TINYINT,
      defaultValue: 0,
      comment: "0 - pending, 1 - approved, 2 - rejected",
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
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("guide_licenses");
}
