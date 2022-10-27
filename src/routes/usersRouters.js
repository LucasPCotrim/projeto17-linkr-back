import express from "express";
import tokenValidation from "../middlewares/authUserMiddleware.js";
import logout from "../controllers/usersControllers/logoutController.js";
import getUser from "../controllers/usersControllers/getUserController.js";
import getPageUser from "../controllers/usersControllers/getPageUserControler.js";
import getUsersbyName from "../controllers/usersControllers/searchUsersController.js";
import { registerFollower, unfollow } from "../controllers/followController.js";
import { checkFollow } from "../controllers/followController.js";
import { followValidator } from "../middlewares/followMiddleware.js";
import { validateFollow } from "../middlewares/followMiddleware.js";
const userRouter = express.Router();

userRouter.get("/logout", tokenValidation, logout);
userRouter.get("/user", tokenValidation, getUser);
userRouter.get("/user/:id", tokenValidation, getPageUser);
userRouter.get("/searchName/:stringName", tokenValidation, getUsersbyName);

userRouter.get("/follow/:userId", tokenValidation, validateFollow, checkFollow);
userRouter.post("/follow", tokenValidation, followValidator, registerFollower);
userRouter.delete("/follow/:userId", tokenValidation, unfollow);

export default userRouter;
