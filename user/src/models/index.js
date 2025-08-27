import sequelize from "../utils/sequelize.js";
import User from "./User.js";
import UserRoleMaster from "./userRoleMaster.js";
import UserRoleMap from "./UserRoleMap.js";

// Associations
User.belongsToMany(UserRoleMaster, {
  through: UserRoleMap,
  foreignKey: "user_master_id"
});

UserRoleMaster.belongsToMany(User, {
  through: UserRoleMap,
  foreignKey: "user_role_master_id"
});

// Export models
export { sequelize, User, UserRoleMaster, UserRoleMap };
