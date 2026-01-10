'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('settings', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    key: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'Setting key (unique identifier)',
    },

    value: {
      type: Sequelize.TEXT('long'),
      allowNull: true,
      comment: 'Setting value (string / JSON)',
    },

    group: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Group like general, auth, booking, payment',
    },

    status: {
      type: Sequelize.TINYINT,
      defaultValue: 1,
      comment: '1: active, 0: inactive',
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('settings');
}
