'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('cms', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    title: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    slug: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    content: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    meta_title: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    meta_keywords: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    meta_description: {
      type: Sequelize.STRING,
      allowNull: true,
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
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('cms');
}
