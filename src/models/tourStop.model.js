import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourStop = sequelize.define(
  "tour_stops",
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
    stop_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "duration in minutes on per stop basis",
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: false,
  }
);

export default TourStop;