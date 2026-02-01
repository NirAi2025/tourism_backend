'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tour_medias', {
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
    type:{
      type: Sequelize.ENUM('cover','gallery', 'video'),
      allowNull: true
    },
    media: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    url: {
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
  await queryInterface.dropTable('tour_medias');
}
