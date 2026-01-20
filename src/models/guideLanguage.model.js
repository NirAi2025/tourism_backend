import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GuideLanguage = sequelize.define(
  "guide_languages",
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

    language: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

export default GuideLanguage;
