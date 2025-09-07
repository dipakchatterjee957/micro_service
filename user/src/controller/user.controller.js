import userService from '../service/user.service.js';
import utils from '../utils/utils.js';

export default new class Usercontroller {

  getUserAllList = async (req, res) => {
    try {
      const data = await userService.getUserAllList(req);
      return utils.sendResponse(res, data, true);
    } catch (error) {
      console.error(error);
      return utils.sendResponse(res, null, false);
    }
  };

  getUserListByBranch = async (req, res) => {
    try {
      const data = await userService.getUserListByBranch(req);
      return utils.sendResponse(res, data, true);
    } catch (error) {
      console.error(error);
      return utils.sendResponse(res, null, false);
    }
  };

  createUser = async (req, res) => {
    try {
      const data = await userService.createUser(req);
      return utils.sendResponse(res, data, true);
    } catch (error) {
      console.error(error);
      return utils.sendResponse(res, null, false, error.message);
    }
  };

  updateUser = async (req, res) => {
    try {
      const data = await userService.updateUser(req);
      return utils.sendResponse(res, data, true);
    } catch (error) {
      console.error(error);
      return utils.sendResponse(res, null, false, error.message);
    }
  };

  deleteUser = async (req, res) => {
    try {
      const data = await userService.deleteUser(req);
      return utils.sendResponse(res, data, true);
    } catch (error) {
      console.error(error);
      return utils.sendResponse(res, null, false, error.message);
    }
  };

  login = async (req, res) => {
    try {
      const data = await userService.login(req);
      return utils.sendResponse(res, data, true);
    } catch (error) {
      console.error(error);
      return utils.sendResponse(res, null, false, error.message);
    }
  };

}