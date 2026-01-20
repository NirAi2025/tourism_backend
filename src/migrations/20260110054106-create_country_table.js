'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('countries', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    slug: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    iso3: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    numeric_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    iso2: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    phone_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    capital: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    currency: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    language: {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    },

    native: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    emoji: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    emojiU: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    status: {
      type: Sequelize.TINYINT,
      defaultValue: 1,
      comment: '1: active, 0: inactive',
    },

    wikiDataId: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    nationality: {
      type: Sequelize.STRING,
      allowNull: true,
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
  await queryInterface.dropTable('countries');
}
