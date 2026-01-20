import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GuideIdentity = sequelize.define(
  "guide_identities",
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

    document_category: {
      type: DataTypes.ENUM(
        "government_id",
        "selfie",
        "address_proof",
        "guide_license",
        "police_verification",
        "tax_certificate",
        "other"
      ),
      allowNull: true,
    },

    document_type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "1: doc upload, 2: video upload, 3: others",
    },

    document_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    document_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    front_side: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    back_side: {
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
      comment: "0=pending, 1=approved, 2=rejected",
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

export default GuideIdentity;
