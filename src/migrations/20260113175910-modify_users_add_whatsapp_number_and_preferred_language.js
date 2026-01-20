"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {

  // whatsapp_number
  await queryInterface.addColumn("users", "whatsapp_number", {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null,
    after: "phone",
  });

  // preferred_language
  await queryInterface.addColumn("users", "preferred_language", {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null,
    after: "profile_image",
  });

  // is_verified
  await queryInterface.addColumn("users", "is_verified", {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    after: "status",
  });

}

export async function down(queryInterface, Sequelize) {

  await queryInterface.removeColumn("users", "whatsapp_number");
  await queryInterface.removeColumn("users", "preferred_language");
  await queryInterface.removeColumn("users", "is_verified");

}
