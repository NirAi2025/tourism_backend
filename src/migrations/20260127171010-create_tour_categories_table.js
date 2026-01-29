'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tour_categories', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    parent_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'tour_categories', key: 'id' },
      onDelete: 'SET NULL',
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    status: {
      type: Sequelize.TINYINT,
      defaultValue: 1,
      comment: '1: active, 0: inactive',
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('tour_categories');
}
