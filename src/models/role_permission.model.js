import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const RolePermission = sequelize.define(
  "role_permissions",
  {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
);

export default RolePermission;
