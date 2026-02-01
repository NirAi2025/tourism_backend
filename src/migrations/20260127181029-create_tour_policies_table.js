"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("tour_policies", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    tour_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: "tours", key: "id" },
      onDelete: "CASCADE",
    },
    cancellation_policy: {
      type: Sequelize.ENUM("FREE", "PARTIAL", "NONE"),
      allowNull: true,
      commemt:
        "FREE - Free cancellation policy, PARTIAL - Partial cancellation policy, NONE - No cancellation policy",
    },
    cancellation_cutoff: {
      type: Sequelize.ENUM(
        "24_HOURS",
        "48_HOURS",
        "72_HOURS",
        "7_DAYS",
        "NO_CANCELLATION",
      ),
      allowNull: true,
      comment: "Cancellation cutoff time in hours before the tour start time",
    },
    no_show_policy: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    weather_policy: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    refund_policy: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    reschedule_policy: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("tour_policies");
}
