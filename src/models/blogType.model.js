import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BlogType = sequelize.define(
  "blog_types",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: "1: active, 0: inactive",
    }
  },
  {
    timestamps: false,
    underscored: true,
    hooks: {
      beforeValidate: (blogType) => {
        // Auto-generate slug if not provided
        if (!blogType.slug && blogType.name) {
          blogType.slug = blogType.name
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

export default BlogType;
