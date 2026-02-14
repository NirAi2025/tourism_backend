import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Wishlist = sequelize.define(
  "wishlists",
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
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      comment: "FK to users table",
    }
  },
  {
    timestamps: true,
    paranoid: false,
    underscored: true,
  },
);
export default Wishlist;
