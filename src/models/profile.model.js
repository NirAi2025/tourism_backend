import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Profile = sequelize.define(
  "profiles",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
    },
    dob: {
      type: DataTypes.DATE,
    },
    gender: {
      type: DataTypes.TINYINT,
      defaultValue: null,
      comment: "1: male, 2: female, 3: other",
    },
    languages: {
      type: DataTypes.TEXT,
    },
    experience_years: {
      type: DataTypes.INTEGER,
    },
    tour_country_id: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    base_city_id: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: null,
    },
    currency: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1, // 1: active, 0: inactive
      comment: "0: pending , 1: active, 2: rejected, 3: banned",
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

export default Profile;