import express from "express";
import { signUp } from "../controllers/signupController.js";
import { signUpValidator } from "../middlewares/signupMiddleware.js";

const router = express.Router();

router.post("/sign-up", signUpValidator, signUp);

export default router;
