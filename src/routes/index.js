import { Router } from 'express';
import usersRouter from './users.routers.js';

const router = Router();

router.use(usersRouter);

export default router;
