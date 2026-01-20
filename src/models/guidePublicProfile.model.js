import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GuidePublicProfile = sequelize.define(
  "guide_public_profiles",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    guide_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    cover_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    google_review_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    tripadvisor_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    instagram_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    linkedin_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_profile_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

export default GuidePublicProfile;
