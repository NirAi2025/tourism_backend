'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tour_tag_maps', {
    tour_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tours',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'FK to tours table',
    },
  
    tag_id: { 
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tags',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'FK to tags table',
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('tour_tag_maps');
}
