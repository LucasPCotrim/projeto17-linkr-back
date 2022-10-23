import express from 'express';
import { hashtag, hashtagsList } from '../controllers/hashtagController.js';
import validUser from '../middlewares/authUserMiddleware.js';
import { validHashtag } from '../middlewares/hashtagMiddleware.js';

const hashtagRouter = express.Router();

hashtagRouter.get('/hashtag', validUser, hashtagsList);
hashtagRouter.get('/hashtag/:hashtag', validUser, validHashtag, hashtag);

export default hashtagRouter;
