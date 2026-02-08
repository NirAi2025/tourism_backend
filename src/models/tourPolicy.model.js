import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourPolicy = sequelize.define(
  "tour_policies",
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
    cancellation_policy: {
      type: DataTypes.ENUM("FREE", "PARTIAL", "NONE"),
      allowNull: true,
    },
    cancellation_cutoff: {
      type: DataTypes.ENUM(
        "24_HOURS",
        "48_HOURS",
        "72_HOURS",
        "7_DAYS",
        "NO_CANCELLATION",
      ),
      allowNull: true,
    },
    no_show_policy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    weather_policy: {    
      type: DataTypes.TEXT,
      allowNull: true,  
    },
    refund_policy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reschedule_policy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: false,
    underscored: true
  }
);

export default TourPolicy;