import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Country = sequelize.define(
  "countries",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    iso3: {
        type: DataTypes.STRING,
    },
    numeric_code: {
        type: DataTypes.STRING,
    },
    iso2: {
        type: DataTypes.STRING,
    },
    phone_code: {
        type: DataTypes.STRING,
    },
    capital: {
        type: DataTypes.STRING,
    },
    currency: {
        type: DataTypes.STRING,
    },
    language: {
        type: DataTypes.TEXT("long")
    },
    native: {
        type: DataTypes.STRING,
    },
    emoji: {
        type: DataTypes.STRING,
    },
    emojiU: {
        type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1, // 1: active, 0: inactive
      comment: "1: active, 0: inactive",
    },
    wikiDataId: {
        type: DataTypes.STRING,
    },
    nationality: {
        type: DataTypes.STRING,
    }
  },
  {
    timestamps: true,
    underscored: true,
  }
);

export default Country;
