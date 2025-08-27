import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize.js";

const UserRoleMap = sequelize.define(
    "userRoleMap",
    {
        user_role_map_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_master_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user_master",
                key: "user_master_id",
            },
        },
        user_role_master_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user_role_master",
                key: "user_role_master_id",
            },
        },
        active_flag: {
            type: DataTypes.ENUM("A", "D"),
            allowNull: false,
            defaultValue: "A",
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updated_on: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        deleted_on: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "user_role_map",
        timestamps: false,
    }
);

export default UserRoleMap;