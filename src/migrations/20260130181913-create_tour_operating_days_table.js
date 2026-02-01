'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tour_operating_days', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    tour_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'tours', key: 'id' },
      onDelete: 'CASCADE',
    },
    day_of_week: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: '1=Sunday, 2=Monday, ..., 7=Saturday',
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    }
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('tour_operating_days');
}
