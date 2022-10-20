import { postInsertion, getPostsWithUserAndMetadata } from '../repositories/postsRepository.js';
const DEFAULT_POSTS_LIMIT = 20;

const publishPost = async (req, res) => {
  try {
    const { url, content } = req.body;

    const insertedPost = await postInsertion({ url, content, userId: 1 });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

async function getPosts(req, res) {
  const limit = req.query.limit || DEFAULT_POSTS_LIMIT;

  try {
    const posts = await getPostsWithUserAndMetadata({ limit });
    res.status(200).send(posts.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { publishPost, getPosts };
