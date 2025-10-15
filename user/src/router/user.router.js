import express from 'express';
import userController from '../controller/user.controller.js';
import { validateToken } from '../utils/validateToken.js';
import { verifyGatewayToken } from '../utils/verifyGatewayToken.js';
const userRouter = express.Router();

userRouter.get(`/getUserAllList`, verifyGatewayToken, userController.getUserAllList);
userRouter.get(`/getUserListByBranch/:branch_master_id`, userController.getUserListByBranch);
userRouter.post(`/createUser`, userController.createUser);
userRouter.put(`/updateUser/:user_master_id`, userController.updateUser);
userRouter.delete(`/deleteUser/:user_master_id`, userController.deleteUser);
userRouter.post(`/login`, userController.login);

export default userRouter;