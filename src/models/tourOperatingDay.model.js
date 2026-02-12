import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourOperatingDay = sequelize.define(
  "tour_operating_days",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    tour_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "tours", key: "id" },
      onDelete: "CASCADE",
      comment: "FK to tours table",
    },
    day_of_week: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '1=Sunday, 2=Monday, ..., 7=Saturday',
    },
  },
  {
    timestamps: false,
    paranoid: false,
    underscored: true
  }
);

export default TourOperatingDay;