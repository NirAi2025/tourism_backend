import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourSearchTag = sequelize.define(
  "tour_search_tags",
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
    tag: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    timestamps: true,
    paranoid: false,
    underscored: true
  }
);

export default TourSearchTag;