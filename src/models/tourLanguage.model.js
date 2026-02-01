import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourLanguage = sequelize.define(
  "tour_languages",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    tour_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: "tours", key: "id" },
      onDelete: "CASCADE",
      comment: "FK to tours table",
    },
    language_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: "languages", key: "id" },
      onDelete: "CASCADE",
      comment: "FK to languages table",
    },
    is_live_guide: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    paranoid: false,
  },
);

export default TourLanguage;
