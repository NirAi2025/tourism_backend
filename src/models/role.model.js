import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Role = sequelize.define(
  "roles",
  {
    name: {
      type: DataTypes.STRING,
    },

    slug: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1, // 1: active, 0: inactive
      comment: "1: active, 0: inactive",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (role) => {
        // Auto-generate slug if not provided
        if (!role.slug && role.name) {
          role.slug = role.name
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

export default Role;
