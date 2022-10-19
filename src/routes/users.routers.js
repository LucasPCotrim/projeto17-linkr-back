import express from 'express';
import authUser from '../middlewares/autUser.middleware.js';
import logout from '../controllers/usersControllers/logout.controller.js'

import routerTest from '../controllers/usersControllers/testeHome.controller.js'

const userRouter = express.Router();

userRouter.get('/logout', authUser, logout);
userRouter.get('/', routerTest);

export default userRouter;