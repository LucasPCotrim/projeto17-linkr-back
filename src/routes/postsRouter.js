import { Router } from 'express';
import { publishPost, getPosts } from '../controllers/postsController.js';
import { postValidation } from '../middlewares/postsMiddleware.js';

const postsRouter = Router();

postsRouter.post('/posts', postValidation, publishPost);
postsRouter.get('/posts', getPosts);

export { postsRouter };
