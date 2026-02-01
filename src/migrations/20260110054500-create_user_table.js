'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
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

    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    country_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    whatsapp_number: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    email_verified_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    phone_verified_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    verification_code: {
      type: Sequelize.BIGINT,
      allowNull: true,
      defaultValue: null,
    },

    profile_image: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    language_id: {
      type: Sequelize.BIGINT,
      allowNull: true
    },  

    fcm_token: {
      type: Sequelize.TEXT('long'),
      allowNull: true,
      defaultValue: null,
    },

    auth_provider: {
      type: Sequelize.TINYINT,
      defaultValue: 1,
      comment: '1: local, 2: google, 3: facebook',
    },

    provider_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    status: {
      type: Sequelize.TINYINT,
      defaultValue: 1,
      comment: '1: active, 0: inactive',
    },

    is_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: '1: verified, 0: not verified, 2: pending',
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

    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
  });

  // 🔹 Unique email (soft delete aware)
  await queryInterface.addIndex(
    'users',
    ['email', 'deleted_at'],
    {
      unique: true,
      name: 'uniq_users_email_deleted_at',
    }
  );

  // 🔹 Unique phone (soft delete aware)
  await queryInterface.addIndex(
    'users',
    ['phone', 'deleted_at'],
    {
      unique: true,
      name: 'uniq_users_phone_deleted_at',
    }
  );

}

export async function down(queryInterface) {
  await queryInterface.removeIndex('users', 'uniq_users_email_deleted_at');
  await queryInterface.removeIndex('users', 'uniq_users_phone_deleted_at');
  await queryInterface.dropTable('users');
}
