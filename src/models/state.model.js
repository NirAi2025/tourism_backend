import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const State = sequelize.define(
  "states",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    slug: {
        type: DataTypes.STRING,
    },
    country_id: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    country_code: {
      type: DataTypes.STRING,
    },
    fips_code: {
      type: DataTypes.STRING,
    },
    iso2: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.STRING,
    },
    flag: {
      type: DataTypes.TINYINT,
      defaultValue: 1, // 1: true, 0: false
      comment: "1: true, 0: false",
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1, // 1: active, 0: inactive
      comment: "1: active, 0: inactive",
    },
    wikiDataId: {
        type: DataTypes.STRING,
    }
  },
  {
    timestamps: true,
    underscored: true,
  }
);

export default State;
