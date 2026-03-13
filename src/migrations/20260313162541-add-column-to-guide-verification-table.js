'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('guide_verifications', 'tour_id', {
    type: Sequelize.BIGINT,
    allowNull: true,
    after: 'guide_id',
    references: { model: 'tours', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('guide_verifications', 'tour_id');
}
