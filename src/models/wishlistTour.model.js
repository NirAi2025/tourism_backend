import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const WishlistTour = sequelize.define(
  "wishlist_tours",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    wishlist_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "wishlists", key: "id" },
      onDelete: "CASCADE",
      comment: "FK to wishlists table",
    },
    tour_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "tours", key: "id" },
      onDelete: "CASCADE",
      comment: "FK to tours table",
    },
  },
  {
    timestamps: true,
    paranoid: false,
    underscored: true,
  },
);
export default WishlistTour;
