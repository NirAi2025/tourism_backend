'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'completed_steps', {
    type: Sequelize.INTEGER,
    allowNull: true,
    comment: 'Number of completed steps in guide onboarding',
    after: 'provider_id', 
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('users', 'completed_steps');
}
