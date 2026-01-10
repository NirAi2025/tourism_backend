import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Blog = sequelize.define(
  "blogs",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    blog_type_id: {
        type: DataTypes.BIGINT,
        allowNull: true,    
    },
    city_id: {
        type: DataTypes.BIGINT,
        allowNull: true,    
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    short_summery: {
      type: DataTypes.TEXT,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    featured_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1, // 1: published, 0: draft
        comment: "1: published, 0: draft",
    },
    total_viewes: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: "Total number of views",
    }
  },
  {
    timestamps: false,
    underscored: true,
  }
);

export default Blog;
