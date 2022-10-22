import { getTrendingHashtags } from "../repositories/hashtagRepository.js";

async function hashtagsList(req, res) {
  try {
    const hashtagList = await getTrendingHashtags();

    res.status(200).send(hashtagList.rows);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function hashtag(req, res) {}

export { hashtag, hashtagsList };
