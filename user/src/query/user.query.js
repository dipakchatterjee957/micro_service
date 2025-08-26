export default {
    GET_USER_LIST: `SELECT * FROM user_master 
    WHERE active_flag = 'A' AND branch_master_id = ? `,

}