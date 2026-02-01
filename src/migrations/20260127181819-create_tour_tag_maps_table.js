'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tour_tag_maps', {
    tour_id: {
      type: Sequelize.BIGINT.UNSIGNED, 
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tours',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    tag_id: {
      type: Sequelize.BIGINT.UNSIGNED, 
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tags',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('tour_tag_maps');
}
