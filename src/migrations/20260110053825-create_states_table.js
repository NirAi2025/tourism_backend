'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('states', {
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

    country_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      defaultValue: null,
    },

    country_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    fips_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    iso2: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    latitude: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    longitude: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    flag: {
      type: Sequelize.TINYINT,
      defaultValue: 1,
      comment: '1: true, 0: false',
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

  // 🔹 Indexes
  await queryInterface.addIndex('states', ['country_id'], {
    name: 'idx_states_country_id',
  });

  await queryInterface.addIndex('states', ['status'], {
    name: 'idx_states_status',
  });
}

export async function down(queryInterface) {
  await queryInterface.removeIndex('states', 'idx_states_country_id');
  await queryInterface.removeIndex('states', 'idx_states_status');
  await queryInterface.dropTable('states');
}
