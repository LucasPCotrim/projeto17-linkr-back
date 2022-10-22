import { getTrendingHashtags } from "../repositories/hashtagRepository.js";
import { getHashtagByName } from "../repositories/hashtagRepository.js";

async function hashtagsList(req, res) {
  try {
    const hashtagList = await getTrendingHashtags();

    res.status(200).send(hashtagList.rows);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function hashtag(req, res) {
  const { hashtag } = req.params;

  try {
    const hashtagPosts = await getHashtagByName(hashtag);

    res.status(200).send(hashtagPosts.rows);
  } catch (error) {
    res.sendStatus(500);
  }
}

export { hashtag, hashtagsList };
