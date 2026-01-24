import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GuidePayoutAccount = sequelize.define(
  "guide_payout_accounts",
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

    account_holder_name: {
      type: DataTypes.STRING,
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

    routing_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    payout_currency: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },

    payout_method: {
      type: DataTypes.ENUM("bank_transfer", "paypal", "stripe", "other"),
      allowNull: true,
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

export default GuidePayoutAccount;
