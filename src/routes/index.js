import { Router } from "express";
import usersRouter from "./usersRouters.js";
import { postsRouter } from "./postsRouter.js";
import loginRouter from "./loginRouter.js";
import signupRouter from "./signupRouter.js";
import hashtagRouter from "./hashtagRouter.js";

const router = Router();

router.use(postsRouter);
router.use(loginRouter);
router.use(usersRouter);
router.use(signupRouter);
router.use(hashtagRouter);

export default router;
