'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tour_safeties', {
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
    safety_instructions: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    fitness_requirements: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    permit_declared: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    insurance_declared: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true
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
  await queryInterface.dropTable('tour_safeties');
}
