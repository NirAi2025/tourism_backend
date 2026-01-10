'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('blogs', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    blog_type_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },

    city_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },

    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    short_summery: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    tags: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    featured_image: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    user_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },

    status: {
      type: Sequelize.TINYINT,
      defaultValue: 1,
      comment: '1: published, 0: draft',
    },

    total_viewes: {
      type: Sequelize.BIGINT,
      defaultValue: 0,
      comment: 'Total number of views',
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
  await queryInterface.dropTable('blogs');
}
