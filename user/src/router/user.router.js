import express from 'express';
import userController from '../controller/user.controller.js';
const userRouter = express.Router();

userRouter.get(`/getUserList/:branch_master_id`, userController.getUserList);
userRouter.post(`/createUser`, userController.createUser);
userRouter.put(`/updateUser/:user_master_id`, userController.updateUser);
userRouter.delete(`/deleteUser/:user_master_id`, userController.deleteUser);

export default userRouter;