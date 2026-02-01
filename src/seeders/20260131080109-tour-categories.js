"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const now = new Date();
  await queryInterface.bulkInsert(
    "tour_categories",
    [
      {
        name: "Adventure",
        slug: "adventure",
        description: "Thrilling and outdoor adventure tours",
        status: 1,
        created_at: now,
        updated_at: now,
      },
      {
        name: "Cultural",
        slug: "cultural",
        description: "Culture, heritage and historical tours",
        status: 1,
        created_at: now,
        updated_at: now,
      },
      {
        name: "Wildlife",
        slug: "wildlife",
        description: "Wildlife safaris and nature experiences",
        status: 1,
        created_at: now,
        updated_at: now,
      },
      {
        name: "Beach & Leisure",
        slug: "beach-leisure",
        description: "Relaxing beach and leisure tours",
        status: 1,
        created_at: now,
        updated_at: now,
      },
      {
        name: "Religious",
        slug: "religious",
        description: "Spiritual and pilgrimage tours",
        status: 1,
        created_at: now,
        updated_at: now,
      },
    ],
    {},
  );

  // Insert sub-categories
  await queryInterface.bulkInsert(
    "tour_categories",
    [
      {
        parent_id: 1,
        name: "Trekking",
        slug: "trekking",
        description: "Mountain and forest trekking tours",
        status: 1,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: 1,
        name: "River Rafting",
        slug: "river-rafting",
        description: "White water rafting adventures",
        status: 1,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: 2,
        name: "Heritage Sites",
        slug: "heritage-sites",
        description: "Famous heritage and historical places",
        status: 1,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: 3,
        name: "Jungle Safari",
        slug: "jungle-safari",
        description: "National park and jungle safaris",
        status: 1,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: 4,
        name: "Island Tours",
        slug: "island-tours",
        description: "Island and coastal holiday packages",
        status: 1,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: 5,
        name: "Pilgrimage",
        slug: "pilgrimage",
        description: "Temple, church and mosque visits",
        status: 1,
        created_at: now,
        updated_at: now,
      },
    ],
    {},
  );
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("tour_categories", null, {});
}
