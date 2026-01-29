'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tour_tickets', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    tour_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: 'tours', key: 'id' },
      onDelete: 'CASCADE',
    },
    ticket_required: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      command: 'Indicates if a ticket is required while trip is started',
    },
    ticket_included: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      command: 'Indicates if a ticket is included in the tour price',
    },
    adult_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    child_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    infant_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: true,
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
  await queryInterface.dropTable('tour_tickets');
}
