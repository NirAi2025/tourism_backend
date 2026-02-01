'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tours', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    guide_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    title: {  
      type: Sequelize.TEXT,
      allowNull: true,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    subtitle: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    tour_category_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'tour_categories', key: 'id' },
      onDelete: 'SET NULL',
    },
    city_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'cities', key: 'id' },
      onDelete: 'SET NULL',
    },
    state_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      // references: { model: 'states', key: 'id' },
      // onDelete: 'SET NULL',
    },
    country_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'countries', key: 'id' },
      onDelete: 'SET NULL',
    },
    place: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    full_description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    what_you_will_do: {
      type: Sequelize.TEXT,
      allowNull: true,    
    },
    key_highlights: {
      type: Sequelize.TEXT,
      allowNull: true,    
    },
    unique_points: {
      type: Sequelize.TEXT,
      allowNull: true,    
    },
    meeting_point_name: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    meeting_point_address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    meeting_point_latitude: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    meeting_point_longitude: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    end_point: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    pickup_offered: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    pickup_details: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    duration: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    duration_type: {
      type: Sequelize.ENUM('HOURS', 'DAYS', 'MINUTES'),
      allowNull: true,
      defaultValue: 'MINUTES',
    },
    minimum_travelers: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    maximum_group_size: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    is_private_tour: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    difficulty_level: {
      type: Sequelize.ENUM('EASY', 'MODERATE', 'HARD'),
      allowNull: true,
    },
    age_min: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    age_max: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    seo_title: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    seo_description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    status: {
      type: Sequelize.TINYINT,
      allowNull: true,
      defaultValue: 2,
      comment: '0=Inactive, 1=Active, 2=Draft',
    },
    completed_steps: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Number of completed steps in tour creation',
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('tours');
}
