import express from "express";
import { hashtag, hashtagsList } from "../controllers/hashtagController.js";
import validUser from "../middlewares/authUser.middleware.js";

const hashtagRouter = express.Router();

hashtagRouter.get("/hashtag", validUser, hashtagsList);
hashtagRouter.get("/hashtag/:hashtag", validUser, hashtag);

export default hashtagRouter;
