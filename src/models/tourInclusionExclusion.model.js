import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourInclusionExclusion = sequelize.define(
  "tour_inclusion_exclusions",
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
    included: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    excluded: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    optional_addons: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: false,
    underscored: true,
  },
);
export default TourInclusionExclusion;
