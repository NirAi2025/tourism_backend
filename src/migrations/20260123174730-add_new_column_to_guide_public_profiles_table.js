'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn(
    'guide_public_profiles',
    'social_media_url',
    {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'google_review_url',
    }
  );
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('guide_public_profiles', 'social_media_url');
}
