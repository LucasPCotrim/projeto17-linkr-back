import { Router } from "express";
import {
  publishPost,
  getPosts,
  updatePosts,
} from "../controllers/postsController.js";
import verificaToken from "../middlewares/autUser.middleware.js";
import { postValidation } from "../middlewares/postsMiddleware.js";

const postsRouter = Router();

postsRouter.post("/posts", postValidation, verificaToken, publishPost);
postsRouter.get("/posts", getPosts);
postsRouter.put("/posts/update", verificaToken, updatePosts);

export { postsRouter };
