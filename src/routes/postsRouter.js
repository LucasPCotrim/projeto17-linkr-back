import { Router } from "express";
import {
  publishPost,
  getPosts,
  updatePosts,
  toggleLikePost,
  deletePost,
  insertComment,
} from "../controllers/postsController.js";
import verificaToken from "../middlewares/authUserMiddleware.js";
import {
  commentValidation,
  postValidation,
} from "../middlewares/postsMiddleware.js";

const postsRouter = Router();

postsRouter.post("/posts", postValidation, verificaToken, publishPost);
postsRouter.get("/posts", verificaToken, getPosts);
postsRouter.put("/posts/update", verificaToken, updatePosts);
postsRouter.post("/posts/:id/like/toggle", verificaToken, toggleLikePost);
postsRouter.delete("/posts/:id", verificaToken, deletePost);
postsRouter.post(
  "/posts/comments/:id",
  commentValidation,
  verificaToken,
  insertComment
);
postsRouter.get("/posts/comments/:id", verificaToken, insertComment);

export { postsRouter };
