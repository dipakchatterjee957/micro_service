import userService from '../service/user.service.js';
import utils from '../utils/utils.js';

export default new class Usercontroller {

    getUserList = async (req, res) => {
        try {
            const data = await userService.getUserList(req);
            return utils.sendResponse(res, data, true);
        } catch (error) {
            console.error(error);
            return utils.sendResponse(res, null, false);
        }
    };

   
}