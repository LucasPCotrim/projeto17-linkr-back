import { Router } from "express";
import usersRouter from './users.routers.js';
import { postsRouter } from "./postsRouter.js";
import loginRouter from "./loginRouter.js";

const router = Router();

router.use(postsRouter);
router.use(loginRouter);
router.use(usersRouter);


export default router;
