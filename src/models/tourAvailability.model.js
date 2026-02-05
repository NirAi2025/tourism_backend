import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourAvailability = sequelize.define(
  "tour_availabilities",
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
    available_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    start_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total_capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    booked_capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
  },
);

export default TourAvailability;
