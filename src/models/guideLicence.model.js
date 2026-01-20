import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GuideLicense = sequelize.define(
  "guide_licenses",
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

    license_type: {
      type: DataTypes.ENUM(
        "licensed_tour_guide",
        "tourism_department_id",
        "local_guide_permit",
        "special_activity_license"
      ),
      allowNull: true,
    },

    license_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    issued_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    city_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    activity_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    document_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    verification_status: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
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

export default GuideLicense;
