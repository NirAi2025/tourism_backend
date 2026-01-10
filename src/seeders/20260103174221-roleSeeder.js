'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('roles', [
    {
      name: 'Super Admin',
      slug: 'super-admin',
      created_at: new Date(),
    },
    {
      name: 'User',
      slug: 'user',
      created_at: new Date(),
    },
    {
      name: 'Guide',
      slug: 'guide',
      created_at: new Date(),
    }
  ], {});
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete(
    'roles',
    {
      slug: ['super-admin', 'user', 'guide'],
    },
    {}
  );
}
