import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourSafety = sequelize.define(
  "tour_safeties",
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
    safety_instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "General safety instructions for the tour",
    },
    fitness_requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Fitness requirements for participants",
    },
    permit_declared: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      comment: "Indicates if necessary permits are declared",
    },
    insurance_declared: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      comment: "Indicates if insurance is declared",
    }
  },
  {
    timestamps: true,
    paranoid: false,
  }
);

export default TourSafety;  