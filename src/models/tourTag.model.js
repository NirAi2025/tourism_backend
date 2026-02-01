import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourTag = sequelize.define(
  "tour_tags",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    hooks: {
      beforeValidate: (tourTag) => {
        // Auto-generate slug if not provided
        if (!tourTag.slug && tourTag.name) {
          tourTag.slug = tourTag.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "") // remove special chars
            .replace(/\s+/g, "-") // spaces to hyphen
            .replace(/-+/g, "-"); // remove duplicate hyphens
        }
      },
    },
  },
);

export default TourTag;
