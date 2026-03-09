'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('cities', 'place_id', {
    type: Sequelize.STRING,
    allowNull: true,
    after: 'slug',
  });
  await queryInterface.addColumn('cities', 'is_iconic', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    after: 'wikiDataId',
  });

  await queryInterface.addColumn('cities', 'iconic_image', {
    type: Sequelize.STRING,
    allowNull: true,
    after: 'is_iconic',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('cities', 'place_id');
  await queryInterface.removeColumn('cities', 'is_iconic');
  await queryInterface.removeColumn('cities', 'iconic_image');
}
