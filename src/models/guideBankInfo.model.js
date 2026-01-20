import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GuideBankInfo = sequelize.define(
  "guide_bank_infos",
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
    bank_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_holder_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    routing_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_verified: {
      type: DataTypes.TINYINT,
      defaultValue: 0, // 0: not verified, 1: verified
      comment: "0: not verified, 1: verified, 2: rejected",
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

export default GuideBankInfo;