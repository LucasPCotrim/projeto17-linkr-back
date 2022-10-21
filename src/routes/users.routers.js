import express from 'express';
import postValidation from '../middlewares/autUser.middleware.js';
import logout from '../controllers/usersControllers/logout.controller.js'

const userRouter = express.Router();

userRouter.get('/logout', postValidation, logout);


export default userRouter;
