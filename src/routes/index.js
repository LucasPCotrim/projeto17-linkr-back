import { postsRouter } from "./postsRouter.js";
import { Router } from "express";

// import authRouter from './authRouter.js';

const router = Router();
router.use(postsRouter);

// router.use(authRouter);

export default router;
