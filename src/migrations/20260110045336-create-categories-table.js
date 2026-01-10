'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('categories', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    parent_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      defaultValue: null,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    slug: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    image: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: Sequelize.TINYINT,
      defaultValue: 1,
      comment: '1: active, 0: inactive',
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },

    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('categories');
}
