"use strict";
import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert(
    "users",
    [
      {
        name: "Super Admin",
        email: "superadmin@tourism.com",
        country_code: "1",
        phone: "1234567890",
        password: bcrypt.hashSync("secret", 10),
        email_verified_at: new Date(),
        phone_verified_at: new Date(),
        created_at: new Date(),
      },
    ],
    {}
  );

  // Get inserted user ID
  const [[user]] = await queryInterface.sequelize.query(
    `SELECT id FROM users WHERE email = 'superadmin@tourism.com' LIMIT 1`
  );

  if (!user) {
    throw new Error("User not found while attaching role");
  }

  // Get role ID of Super Admin
  const [[role]] = await queryInterface.sequelize.query(
    `SELECT id FROM roles WHERE slug = 'super-admin' LIMIT 1`
  );

  if (!role) {
    throw new Error("Super Admin role not found");
  }

  // Attach role to user
  await queryInterface.bulkInsert("user_roles", [
    {
      user_id: user.id,
      role_id: role.id,
    },
  ]);
}
export async function down(queryInterface, Sequelize) {
  const [[user]] = await queryInterface.sequelize.query(
    `SELECT id FROM users WHERE email = 'superadmin@tourism.com' LIMIT 1`
  );

  if (user) {
    // Delete from user_roles first
    await queryInterface.bulkDelete("user_roles", { user_id: user.id }, {});
  }
  await queryInterface.bulkDelete(
    "users",
    {
      email: "superadmin@tourism.com",
    },
    {}
  );
}
