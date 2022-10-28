import { getTrendingHashtags } from "../repositories/hashtagRepository.js";
import { getHashtagByName } from "../repositories/hashtagRepository.js";

const DEFAULT_POSTS_LIMIT = 20;

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
  const limit = req.query.limit || DEFAULT_POSTS_LIMIT;
  const offset = req.query.offset || 0;

  try {
    const hashtagPosts = await getHashtagByName({
      hashtagName: hashtag,
      limit,
      offset,
    });

    res.status(200).send(hashtagPosts.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { hashtag, hashtagsList };
