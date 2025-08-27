import userQuery from "../query/user.query.js";
import connection from "../utils/mysql.controller.js";
import User from "../models/User.js";

export default new class Userservice {

    // getUserList = async (req) => {
    //     try {
    //         const queryString = userQuery.GET_USER_LIST;
    //         const params = [ req.params.branch_master_id];
    //         const data = await connection.query(queryString, params);
    //         return data.response;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    async getUserAllList(req) {
        try {
            const users = await User.findAll({
                where: { active_flag: "A" }, // filtering like your old query   
        });
            return users;
        } catch (error) {
            throw error;
        }
    }

    async getUserListByBranch(req) {
        try {
            const { branch_master_id } = req.params;

            const users = await User.findAll({
                where: { branch_master_id, active_flag: "A" }, // filtering like your old query
                attributes: [
                    "user_master_id",
                    "user_name",
                    "email_primary",
                    "mobile_primary",
                    "job_status",
                    "active_flag"
                ]
            });

            return users;
        } catch (error) {
            throw error;
        }
    }

    async createUser(req) {
        try {
            const user = await User.create(req.body);
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Update user
    async updateUser(req) {
        try {
            const { user_master_id } = req.params;
            const [updated] = await User.update(req.body, {
                where: { user_master_id }
            });

            if (updated) {
                return await User.findByPk(user_master_id); // return updated user
            }
            throw new Error("User not found");
        } catch (error) {
            throw error;
        }
    }

    // Delete user
    async deleteUser(req) {
        try {
            const { user_master_id } = req.params;
            const deleted = await User.destroy({
                where: { user_master_id }
            });

            if (!deleted) throw new Error("User not found");
            return { message: "User deleted successfully" };
        } catch (error) {
            throw error;
        }
    }
};
