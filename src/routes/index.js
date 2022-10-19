import { Router } from "express";
import { postsRouter } from "./postsRouter.js";
import loginRouter from "./loginRouter.js";

const router = Router();

router.use(postsRouter);
router.use(loginRouter);

export default router;
