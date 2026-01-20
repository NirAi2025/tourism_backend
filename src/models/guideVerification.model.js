import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GuideVerification = sequelize.define(
  "guide_verifications",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    guide_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    verified_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    verification_date: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 0, // 0: pending, 1: verified, 2: rejected
      comment: "0: pending, 1: verified, 2: rejected",
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

export default GuideVerification;