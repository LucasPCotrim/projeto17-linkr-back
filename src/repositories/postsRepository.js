import db from "../database/database.js";

const postInsertion = ({ url, content, userId, metadataId }) => {
  return db.query(
    `INSERT INTO posts (url,content,"userId","metadataId") VALUES ($1, $2, $3, $4) RETURNING id;`,
    [url, content, userId, metadataId]
  );
};

const hashtagInsertion = (hashtag) => {
  return db.query("INSERT INTO hashtags (name) VALUES ($1) RETURNING id;", [
    hashtag,
  ]);
};

const selectHashtag = (hashtag) => {
  return db.query("SELECT * FROM hashtags WHERE name = $1", [hashtag]);
};

const hashtagsPostsInsertion = ({ postId, hashtagId }) => {
  return db.query(
    `INSERT INTO "hashtagsPosts" ("postId", "hashtagId") VALUES ($1, $2);`,
    [postId, hashtagId]
  );
};

async function insertLinkMetadata({ image, title, description }) {
  return db.query(
    `INSERT INTO metadata
      (image, title, description)
    VALUES
      ($1, $2, $3)
    RETURNING id`,
    [image, title, description]
  );
}

async function insertPostVisits({ postId }) {
  return db.query(
    `INSERT INTO visits
      ("postId")
    VALUES
      ($1)`,
    [postId]
  );
}

async function getRecentPosts({ limit }) {
  return db.query(
    `SELECT
      "p"."id" AS "id",
      "p"."url",
      "p"."content",
      json_build_object('name', "u"."name", 'email', "u"."email", 'profilePic', "u"."profilePic", 'id', "u"."id") AS "user",
      json_build_object('image', "m"."image", 'title', "m"."title", 'description', "m"."description") AS "metadata",
      ARRAY(
        SELECT
            json_build_object('name', "l_u"."name", 'email', "l_u"."email")
        FROM
            posts "l_p"
            LEFT JOIN likes "l_l" ON l_l."postId" = "l_p"."id"
            JOIN users "l_u" ON "l_u"."id" = "l_l"."userId"
        WHERE "l_l"."postId" = "p"."id"
        ORDER BY "l_l"."createdAt" DESC
      ) AS "usersWhoLiked",
      COALESCE ("v"."count", 0) AS "visitCount",
      ARRAY(
        SELECT
          json_build_object('id',"h_h"."id", 'name', "h_h"."name")
        FROM
          "posts" "h_p"
          JOIN "hashtagsPosts" "h_hp" ON "h_p"."id" = "h_hp"."postId"
          JOIN "hashtags" "h_h" ON "h_hp"."hashtagId" = "h_h"."id"
        WHERE "h_p"."id" = "p"."id"
      ) AS "hashtagsList"
    FROM
      posts "p"
      JOIN users "u" ON "p"."userId" = "u"."id"
      JOIN metadata "m" ON "p"."metadataId" = "m"."id"
      LEFT JOIN visits "v" ON "v"."postId" = "p"."id"
    ORDER BY "p"."createdAt" DESC
    LIMIT $1;`,
    [limit]
  );
}

async function getPostById(postId) {
  return db.query(`SELECT * FROM posts WHERE id = $1;`, [postId]);
}

async function updateContentPost(postId, content) {
  return db.query(`UPDATE posts SET content = $1 WHERE posts.id = $2;`, [
    content,
    postId,
  ]);
}

async function getUserLikeOnPostById({ postId, userId }) {
  return db.query(
    `SELECT * FROM likes WHERE "postId" = $1 AND "userId" = $2;`,
    [postId, userId]
  );
}

async function likePostById({ postId, userId }) {
  return db.query(`INSERT INTO likes ("userId", "postId") VALUES ($1, $2);`, [
    userId,
    postId,
  ]);
}

async function dislikePostById({ postId, userId }) {
  return db.query(`DELETE FROM likes WHERE "postId" = $1 AND "userId" = $2;`, [
    postId,
    userId,
  ]);
}

const deletePostById = ({ postId, userId }) => {
  return db.query(`DELETE FROM posts WHERE "id" = $1 AND "userId" = $2;`, [
    postId,
    userId,
  ]);
};

async function getRepostByPostId(postId) {
  return db.query(`SELECT * FROM reposts WHERE "postId" = $1;`, [postId]);
}

async function insertRepost({ userId, postId }) {
  return db.query(`INSERT INTO reposts ("userId", "postId") VALUES ($1,$2);`, [
    userId,
    postId,
  ]);
}
export {
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
};
