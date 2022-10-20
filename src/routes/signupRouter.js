import express from "express";
import { signUp } from "../controllers/signupController.js";
import { signUpValidator } from "../middlewares/signupMiddleware.js";

const signupRouter = express.Router();

signupRouter.post("/sign-up", signUpValidator, signUp);

export default signupRouter;
