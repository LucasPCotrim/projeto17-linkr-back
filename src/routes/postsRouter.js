import { Router } from "express";
import { publishPost } from "../controllers/postsController.js";
import { postValidation } from "../middlewares/postsMiddleware.js";

const postsRouter = Router();

postsRouter.post("/posts", postValidation, publishPost);

export { postsRouter };
