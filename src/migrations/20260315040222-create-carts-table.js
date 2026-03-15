'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("carts", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      comment: "FK to users table",
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    total_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "USD",
    },
    status: {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "1 : active, 2: checked out, 3: cancelled",
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
  })
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("carts");
}
