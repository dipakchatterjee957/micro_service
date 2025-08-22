import userQuery from "../query/user.query.js";
import connection from "../utils/mysql.controller.js";

export default new class Userservice {

    getUserList = async (req) => {
        try {
            const queryString = userQuery.GET_USER_LIST;
            const params = [req.body.branch_master_id];
            const data = await connection.query(queryString, params);
            return data.response;
        } catch (error) {
            throw error;
        }
    };
};
