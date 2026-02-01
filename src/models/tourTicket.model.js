import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourTicket = sequelize.define(
  "tour_tickets",
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
    ticket_required: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    ticket_included: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    adult_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    child_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    infant_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: true,
    paranoid: false,
  }
);

export default TourTicket;