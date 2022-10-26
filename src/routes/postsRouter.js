import { Router } from "express";
import {
  publishPost,
  getPosts,
  updatePosts,
  toggleLikePost,
  deletePost,
  repost,
  getRepostsQnt,
} from "../controllers/postsController.js";
import verificaToken from "../middlewares/authUserMiddleware.js";
import { postValidation } from "../middlewares/postsMiddleware.js";

const postsRouter = Router();

postsRouter.post("/posts", postValidation, verificaToken, publishPost);
postsRouter.get("/posts", verificaToken, getPosts);
postsRouter.put("/posts/update", verificaToken, updatePosts);
postsRouter.post("/posts/:id/like/toggle", verificaToken, toggleLikePost);
postsRouter.delete("/posts/:id", verificaToken, deletePost);
postsRouter.post("/reposts/:id", verificaToken, repost);
postsRouter.get("/reposts/:id", verificaToken, getRepostsQnt);

export { postsRouter };
