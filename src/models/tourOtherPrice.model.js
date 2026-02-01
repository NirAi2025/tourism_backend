import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourOtherPrice = sequelize.define(
  "tour_other_prices",
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
    start_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    override_price: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Name of the additional price",
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: false,    
  }
);

export default TourOtherPrice;