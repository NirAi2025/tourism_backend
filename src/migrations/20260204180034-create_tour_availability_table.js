'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tour_availabilities', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    tour_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'tours', key: 'id' },
      onDelete: 'CASCADE',
    },
    available_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    start_time: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    total_capacity: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    booked_capacity: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    is_blocked: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: "0=Available, 1=Blocked",
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    }
  })
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('tour_availability');
}
