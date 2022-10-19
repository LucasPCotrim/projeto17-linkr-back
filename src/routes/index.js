import { Router } from "express";
// import authRouter from './authRouter.js';
import loginRouter from "./loginRouter.js";

const router = Router();

// router.use(authRouter);
router.use(loginRouter);

export default router;
