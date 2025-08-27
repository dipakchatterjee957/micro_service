import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize.js";

const UserRoleMaster = sequelize.define("UserRoleMaster",
    {
        user_role_master_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role_code: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        role_description: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        active_flag: {
            type: DataTypes.ENUM('A', 'D'),
            allowNull: false,
            defaultValue: 'A'
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updated_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        deleted_on: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: "user_role_master",
        timestamps: false,
    });

export default UserRoleMaster;