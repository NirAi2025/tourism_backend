import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TourCategory = sequelize.define(
  'tour_categories',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: 'tour_categories', key: 'id' },
      onDelete: 'SET NULL',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '1: active, 0: inactive',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
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

export default TourCategory;