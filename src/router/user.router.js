import express from 'express';
import userController from '../controller/user.controller.js';
const userRouter = express.Router();

userRouter.get(`/getUserList/:branch_master_id`, userController.getUserList);

export default userRouter;