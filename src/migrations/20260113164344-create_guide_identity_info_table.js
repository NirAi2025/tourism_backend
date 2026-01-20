'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("guide_identities", {
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

    document_category: {
      type: Sequelize.ENUM(
        "government_id",
        "selfie",
        "address_proof",
        "guide_license",
        "police_verification",
        "tax_certificate",
        "other"
      ),
      allowNull: true,
    },

    document_type: {
      type: Sequelize.TINYINT,
      defaultValue: null,
      comment: "1: doc upload, 2: video upload, 3: others",
    },

    document_file: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    document_number: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "ID number if applicable",
    },

    front_side: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    back_side: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    expiry_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    verification_status: {
      type: Sequelize.TINYINT,
      defaultValue: 0,
      comment: "0=pending, 1=approved, 2=rejected",
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
  await queryInterface.dropTable("guide_identities");
}
