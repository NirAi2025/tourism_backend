"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("cart_details", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    cart_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: "carts", key: "id" },
      onDelete: "CASCADE",
      comment: "FK to carts table",
    },
    tour_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: "tours", key: "id" },
      onDelete: "CASCADE",
      comment: "FK to tours table",
    },
    tour_availability_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      comment: "FK to tour schedule/date table",
      onDelete: "CASCADE",
      references: { model: "tour_availabilities", key: "id" },
    },
    guide_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      comment: "Guide who created the tour",
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    tour_type: {
      type: Sequelize.ENUM("GROUP", "PRIVATE"),
      allowNull: true,
      comment: "Indicates whether the tour is group or private",
    },
    is_whole_pricing: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: "Indicates if the pricing is for the whole tour or per person",
    },
    is_tickiting: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: "Indicates if the tour requires ticketing",
    },
    total_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
      comment: "The total price for the cart item",
    },
    other_prices: {
      type: Sequelize.JSON,
      allowNull: true,
      comment: "Any additional price components, such as taxes, fees, etc.",
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price_details: {
      type: Sequelize.JSON,
      allowNull: true,
      comment:
        "Detailed pricing breakdown, including base price, taxes, fees, etc.",
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "The quantity of the tour being booked",
    },
    adult_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    child_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    infant_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    price_per_person: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: "Snapshot price per person at time of adding to cart",
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
      defaultValue: Sequelize.fn("NOW"),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("cart_details");
}
