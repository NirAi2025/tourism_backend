import { DataTypes} from "sequelize";
import sequelize from "../config/database.js";

const Language = sequelize.define(
  "languages",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      comment: "ISO language code like en, fr, es",
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

export default Language;