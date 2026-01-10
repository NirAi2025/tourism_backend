'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('categories', 'description', {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue: null,
    after: 'image'
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('categories', 'description');
}
