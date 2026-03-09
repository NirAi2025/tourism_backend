import { DataTypes } from "sequelize";
import slugify from "slugify";
import sequelize from "../config/database.js";

const City = sequelize.define(
  "cities",
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
    place_id: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    state_id: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    state_code: {
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
    type: {
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
      field: 'wikiDataId',
    },
    is_iconic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    iconic_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    paranoid: true,
    hooks: {
      beforeCreate: (city) => {
        if (city.name) {
          city.slug = slugify(city.name, { lower: true, strict: true });
        }
      },
      beforeUpdate: (city) => {
        if (city.name) {
          city.slug = slugify(city.name, { lower: true, strict: true });
        }
      },
    },
  }
);

export default City;
