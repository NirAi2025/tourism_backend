import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Tour = sequelize.define(
  "tours",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT,
    },
    guide_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tour_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: "tour_categories", key: "id" },
      onDelete: "SET NULL",
    },
    city_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: "cities", key: "id" },
      onDelete: "SET NULL",
    },
    state_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // references: { model: "states", key: "id" },
      // onDelete: "SET NULL",
    },
    country_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: "countries", key: "id" },
      onDelete: "SET NULL",
    },
    place: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    full_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    what_you_will_do: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    key_highlights: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    unique_points: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meeting_point_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meeting_point_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meeting_point_latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meeting_point_longitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    end_point: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pickup_offered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    pickup_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration_type: {
      type: DataTypes.ENUM("HOURS", "DAYS", "MINUTES"),
      allowNull: true,
      defaultValue: "MINUTES",
    },
    minimum_travelers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    maximum_group_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_private_tour: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    skip_the_line_access: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    difficulty_level: {
      type: DataTypes.ENUM("EASY", "MODERATE", "HARD"),
      allowNull: true,
    },
    accessibility_options: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    not_suitable_for: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    season_start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    season_end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    age_min: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    age_max: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    what_to_bring: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dress_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    important_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    seo_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seo_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 2,
      comment: "0=Inactive, 1=Active, 2=Draft",
    },
    completed_steps: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "Number of completed steps in tour creation",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    hooks: {
      beforeValidate: (tour) => {
        // Auto-generate slug if not provided
        if (!tour.slug && tour.title) {
          tour.slug = tour.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "") // remove special chars
            .replace(/\s+/g, "-") // spaces to hyphen
            .replace(/-+/g, "-"); // remove duplicate hyphens
        }
      },
    },
  },
);

export default Tour;
