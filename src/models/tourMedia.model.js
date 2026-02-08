import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourMedia = sequelize.define(
  "tour_medias",
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
    type: {
      type: DataTypes.ENUM('cover','gallery', 'video'),
      allowNull: true,
    },
    media: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "URL of the media file",
    }
  },
  {
    timestamps: true,
    paranoid: false,
    underscored: true
  }
);

export default TourMedia;