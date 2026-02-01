'use strict';


/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tour_other_prices', {
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
    start_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    end_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    override_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    reason: {
      type: Sequelize.TEXT,
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
  await queryInterface.dropTable('tour_other_prices');
}
