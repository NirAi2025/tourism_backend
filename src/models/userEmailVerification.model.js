import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserEmailVerification = sequelize.define(
    "user_email_verifications",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        verification_link: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        verified_at: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    },
    {
        timestamps: true,
        underscored: true
    }
)

export default UserEmailVerification;