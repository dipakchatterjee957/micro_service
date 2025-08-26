import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize.js";

const User = sequelize.define("User", {
  user_master_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  branch_master_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_designation_master_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  login_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: "c7ed284280357f70dc3e9bc39d5f3305",
  },
  salt: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: "d4df3595-2984-453c-9f44-f11673108bdc",
  },
  mobile_primary: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  mobile_secondary: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  email_primary: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  email_secondary: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  job_status: {
    type: DataTypes.ENUM("PR", "LT", "W"),
    defaultValue: "PR",
  },
  active_flag: {
    type: DataTypes.ENUM("A", "D"),
    defaultValue: "A",
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_on: {
    type: DataTypes.DATE,
    allowNull: false,
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
}, {
  tableName: "user_master",
  timestamps: false,  // since you have your own created_on, updated_on fields
});

export default User;