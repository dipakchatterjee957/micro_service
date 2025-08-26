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

    async getUserList(req) {
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
};
