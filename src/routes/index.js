import { Router } from "express";
import usersRouter from "./users.routers.js";
import { postsRouter } from "./postsRouter.js";
import loginRouter from "./loginRouter.js";
import signup from "./signupRouter.js";

const router = Router();

router.use(postsRouter);
router.use(loginRouter);
router.use(usersRouter);
router.use(signup);

export default router;
