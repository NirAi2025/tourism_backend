'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('wishlists', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    tour_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'tours', key: 'id' },
      onDelete: 'CASCADE',
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    }
  })
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('wishlists');
}
