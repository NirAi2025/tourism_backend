import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourTagMap = sequelize.define(
    "tour_tag_maps",
    {
    tour_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "FK to tours table",
    },

    tag_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "FK to tags table",
    },
  },
  {
    timestamps: false, 
    paranoid: false
  }
);

export default TourTagMap;