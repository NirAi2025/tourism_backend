import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Itinerary = sequelize.define(
  "tour_itineraries",
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
    overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
},
  {
    timestamps: true,
    paranoid: false,
    underscored: true
  }
);

export default Itinerary;