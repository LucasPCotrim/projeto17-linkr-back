import {
  postInsertion,
  insertLinkMetadata,
  insertPostVisits,
  getRecentPosts,
  hashtagInsertion,
  hashtagsPostsInsertion,
  selectHashtag,
  getPostById,
  updateContentPost,
  getUserLikeOnPostById,
  likePostById,
  dislikePostById,
  deletePostById,
  getRepostByPostId,
  insertRepost,
} from "../repositories/postsRepository.js";
import { deleteOldHashtags } from "../repositories/hashtagRepository.js";
import findHashtags from "find-hashtags";
import urlMetadata from "url-metadata";

const DEFAULT_POSTS_LIMIT = 20;

const publishPost = async (req, res) => {
  try {
    const { url, content } = req.body;
    const { user } = res.locals;
    const { image, title, description } = await urlMetadata(url);
    const insertedMetadata = await insertLinkMetadata({
      image,
      title,
      description,
    });
    const metadataId = insertedMetadata.rows[0].id;

    const insertedPost = await postInsertion({
      url,
      content,
      userId: user.id,
      metadataId,
    });
    const postId = insertedPost.rows[0].id;
    insertPostVisits({ postId });

    const hashtags = findHashtags(content);
    const hashtagsId = [];
    if (hashtags.length !== 0) {
      for (let i = 0; i < hashtags.length; i++) {
        const isRepeatedHashtag = (await selectHashtag(hashtags[i])).rows[0];
        if (isRepeatedHashtag) {
          hashtagsId.push(isRepeatedHashtag.id);
          continue;
        }
        let hashtag = await hashtagInsertion(hashtags[i]);
        hashtagsId.push(hashtag.rows[0].id);
      }

      for (let i = 0; i < hashtagsId.length; i++) {
        hashtagsPostsInsertion({
          postId,
          hashtagId: hashtagsId[i],
        });
      }
    }

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

async function getPosts(req, res) {
  const limit = req.query.limit || DEFAULT_POSTS_LIMIT;

  try {
    const posts = await getRecentPosts({ limit });
    res.status(200).send(posts.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function updatePosts(req, res) {
  const { postId, content } = req.body;
  const user = res.locals.user;
  try {
    const validUserPost = await getPostById(postId);
    if (validUserPost.rows[0].userId !== user.id) {
      return res.sendStatus(401);
    }
    await updateContentPost(postId, content);

    const hashtags = findHashtags(content);
    const hashtagsId = [];
    if (hashtags.length !== 0) {
      for (let i = 0; i < hashtags.length; i++) {
        const isRepeatedHashtag = (await selectHashtag(hashtags[i])).rows[0];
        if (isRepeatedHashtag) {
          hashtagsId.push(isRepeatedHashtag.id);
          continue;
        }
        let hashtag = await hashtagInsertion(hashtags[i]);
        hashtagsId.push(hashtag.rows[0].id);
      }
      deleteOldHashtags(postId);
      for (let i = 0; i < hashtagsId.length; i++) {
        hashtagsPostsInsertion({
          postId,
          hashtagId: hashtagsId[i],
        });
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function toggleLikePost(req, res) {
  const { id } = req.params;
  const user = res.locals.user;
  try {
    const result = await getUserLikeOnPostById({ postId: id, userId: user.id });

    if (result.rowCount > 0) {
      await dislikePostById({ postId: id, userId: user.id });
    } else {
      await likePostById({ postId: id, userId: user.id });
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

const deletePost = async (req, res) => {
  const { id: postId } = req.params;
  const userId = res.locals?.user?.id;
  try {
    await deletePostById({ postId, userId });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const repost = async (req, res) => {
  const user = res.locals.user;
  const { id: postId } = req.params;
  try {
    const existRepost = await getRepostByPostId(postId);
    if (existRepost.rowCount !== 0) {
      return res.sendStatus(409);
    }
    await insertRepost({ userId: user.id, postId });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export {
  publishPost,
  getPosts,
  updatePosts,
  toggleLikePost,
  deletePost,
  repost,
};
