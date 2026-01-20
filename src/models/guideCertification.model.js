import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GuideCertification = sequelize.define(
  "guide_certifications",
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

    certification_type: {
      type: DataTypes.ENUM("first_aid", "safety_training", "other"),
      allowNull: false,
    },

    certificate_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    verification_status: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },

    rejection_reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

export default GuideCertification;
