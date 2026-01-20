import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GuideInsurance = sequelize.define(
  "guide_insurances",
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

    insurance_provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    policy_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    policy_expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    insurance_document: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    emergency_contact_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    emergency_contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    emergency_contact_relation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

export default GuideInsurance;
