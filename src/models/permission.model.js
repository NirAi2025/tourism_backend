import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Permission = sequelize.define(
  "permissions",
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
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["slug", "deleted_at"],
        name: "uniq_permissions_slug_deleted_at",
      },
    ],
  }
);

export default Permission;
