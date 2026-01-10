'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('cities', {
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

    state_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      defaultValue: null,
    },

    state_code: {
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

    type: {
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
  await queryInterface.addIndex('cities', ['country_id'], {
    name: 'idx_cities_country_id',
  });

  await queryInterface.addIndex('cities', ['state_id'], {
    name: 'idx_cities_state_id',
  });

}

export async function down(queryInterface) {
  await queryInterface.removeIndex('cities', 'idx_cities_country_id');
  await queryInterface.removeIndex('cities', 'idx_cities_state_id');
  await queryInterface.dropTable('cities');
}
