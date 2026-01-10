import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    country_code: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    email_verified_at: {
      type: DataTypes.DATE,
    },
    phone_verified_at: {
      type: DataTypes.DATE,
    },
    verification_code: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    profile_image: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    fcm_token: {
      type: DataTypes.TEXT("long"),
      defaultValue: null,
    },
    auth_provider: {
      type: DataTypes.TINYINT,
      defaultValue: 1, // 1: local, 2: google, 3: facebook
      comment: "1: local, 2: google, 3: facebook",
    },
    provider_id: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1, // 1: active, 0: inactive
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
        fields: ["email", "deleted_at"],
        name: "uniq_users_email_deleted_at",
      },
      {
        unique: true,
        fields: ["phone", "deleted_at"],
        name: "uniq_users_phone_deleted_at",
      },
    ],
  }
);

export default User;
