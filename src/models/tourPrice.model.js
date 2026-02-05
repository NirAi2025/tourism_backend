import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourPrice = sequelize.define(
  "tour_prices",
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
    price_type_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: "price_types", key: "id" },
      onDelete: "SET NULL",
      comment: "FK to price_types table",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: true,
      defaultValue: "USD",
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: false,
    underscored: true
  }
);

export default TourPrice;