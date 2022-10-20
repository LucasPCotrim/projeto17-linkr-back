import {
  postInsertion,
  insertLinkMetadata,
  getPostsWithUserAndMetadata,
} from '../repositories/postsRepository.js';
import urlMetadata from 'url-metadata';
const DEFAULT_POSTS_LIMIT = 20;

const publishPost = async (req, res) => {
  try {
    const { url, content } = req.body;

    const { image, title, description } = await urlMetadata(url);
    const insertedMetadata = await insertLinkMetadata({ image, title, description });
    const metadataId = insertedMetadata.rows[0].id;

    const insertedPost = await postInsertion({ url, content, userId: 1, metadataId });

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
