import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Setting = sequelize.define(
  "settings",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    key: {
      type: DataTypes.STRING,
      comment: "Setting key (unique identifier)",
    },

    value: {
      type: DataTypes.TEXT("long"),
      comment: "Setting value (string / JSON)",
    },

    group: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Group like general, auth, booking, payment",
    },

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: "1: active, 0: inactive",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
);

export default Setting;
