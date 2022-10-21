import express from "express";
import authUser from "../middlewares/authUser.middleware.js";
import logout from "../controllers/usersControllers/logout.controller.js";
import { getUser } from "../controllers/loginController.js";

const userRouter = express.Router();

userRouter.get("/logout", authUser, logout);
userRouter.get("/user", authUser, getUser);

export default userRouter;
