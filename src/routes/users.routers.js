import express from 'express';
import tokenValidation from '../middlewares/authUserMiddleware.js';
import logout from '../controllers/usersControllers/logoutController.js'
import getUser from '../controllers/usersControllers/getUserController.js';

const userRouter = express.Router();

userRouter.get('/logout', tokenValidation, logout);
userRouter.get('/user', tokenValidation, getUser);

export default userRouter;
