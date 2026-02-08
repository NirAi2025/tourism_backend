import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PriceType = sequelize.define(
  "price_types",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Description of the price type",
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: "1: active, 0: inactive",
    },
  },
  {
    timestamps: true,
    paranoid: false,
    underscored: true,
  }
);

export default PriceType;