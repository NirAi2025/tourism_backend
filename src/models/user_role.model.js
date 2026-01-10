import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserRole = sequelize.define(
  "user_roles",
  {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "FK to users table",
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "FK to roles table",
    },
  },
  {
    timestamps: false, 
    paranoid: false
  }
);

export default UserRole;
