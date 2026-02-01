'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tour_search_tags', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    tour_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'tours', key: 'id' },
      onDelete: 'CASCADE',
    },
    tag: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    }
  }); 
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('tour_search_tags');
}
