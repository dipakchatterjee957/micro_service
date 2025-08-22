import express from 'express';
import userController from '../controller/user.controller.js';
const userRouter = express.Router();

userRouter.post(`/getUserList`, userController.getUserList);

export default userRouter;