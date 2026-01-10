import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define(
  "categories",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
    },
    name: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
        comment: "1: active, 0: inactive",
    },
  },
  {
    timestamps: true,
    underscored: true,
    paranoid: true,
    hooks: {
      beforeValidate: (category) => {
        // Auto-generate slug if not provided
        if (!category.slug && category.name) {
          category.slug = category.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "") // remove special chars
            .replace(/\s+/g, "-") // spaces to hyphen
            .replace(/-+/g, "-"); // remove duplicate hyphens
        }
      },
    },
  }
);

export default Category;