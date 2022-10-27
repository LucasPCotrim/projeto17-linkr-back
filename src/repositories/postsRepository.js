import db from '../database/database.js';

const postInsertion = ({ url, content, userId, metadataId }) => {
  return db.query(
    `INSERT INTO posts (url,content,"userId","metadataId") VALUES ($1, $2, $3, $4) RETURNING id;`,
    [url, content, userId, metadataId]
  );
};

const hashtagInsertion = (hashtag) => {
  return db.query('INSERT INTO hashtags (name) VALUES ($1) RETURNING id;', [hashtag]);
};

const selectHashtag = (hashtag) => {
  return db.query('SELECT * FROM hashtags WHERE name = $1', [hashtag]);
};

const hashtagsPostsInsertion = ({ postId, hashtagId }) => {
  return db.query(`INSERT INTO "hashtagsPosts" ("postId", "hashtagId") VALUES ($1, $2);`, [
    postId,
    hashtagId,
  ]);
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

async function getPostsWithLimitAndOffset({ userId, limit, offset }) {
  return db.query(
    `SELECT "userWhoRepost", "nameUserWhoRepost", "id", "url", "content" , "user", "metadata", "usersWhoLiked", "visitCount", "hashtagsList", "createdAt" FROM(SELECT
      "p"."createdAt" AS "createdAt",
      null AS "userWhoRepost",
      null AS "nameUserWhoRepost",																																	 
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
      LEFT JOIN reposts "r" ON "r"."postId" = "p"."id"
      LEFT JOIN users "u2" ON "r"."userId" = "u2"."id"
	    LEFT JOIN followers f ON f."userId" = u.id
	    WHERE f."followerId" = $1 OR p."userId" = $1
      UNION ALL
      SELECT
      "r"."createdAt" AS "createdAt",
      "r"."userId" AS "userWhoRepost",
      "u2".name AS "nameUserWhoRepost",
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
      RIGHT JOIN reposts "r" ON "r"."postId" = "p"."id"
      LEFT JOIN users "u2" ON "r"."userId" = "u2"."id")
    AS results
      ORDER BY "createdAt" DESC
      LIMIT $2
      OFFSET $3;
	`,
    [userId, limit, offset]
  );
}

async function getPostById(postId) {
  return db.query(`SELECT * FROM posts WHERE id = $1;`, [postId]);
}

async function updateContentPost(postId, content) {
  return db.query(`UPDATE posts SET content = $1 WHERE posts.id = $2;`, [content, postId]);
}

async function getUserLikeOnPostById({ postId, userId }) {
  return db.query(`SELECT * FROM likes WHERE "postId" = $1 AND "userId" = $2;`, [postId, userId]);
}

async function likePostById({ postId, userId }) {
  return db.query(`INSERT INTO likes ("userId", "postId") VALUES ($1, $2);`, [userId, postId]);
}

async function dislikePostById({ postId, userId }) {
  return db.query(`DELETE FROM likes WHERE "postId" = $1 AND "userId" = $2;`, [postId, userId]);
}

const deletePostById = ({ postId, userId }) => {
  return db.query(`DELETE FROM posts WHERE "id" = $1 AND "userId" = $2;`, [postId, userId]);
};

async function getRepostByPostId(postId) {
  return db.query(`SELECT * FROM reposts WHERE "postId" = $1;`, [postId]);
}

async function getRepostByUserId(userId) {
  return db.query(`SELECT * FROM reposts WHERE "userId" = $1;`, [userId]);
}

async function getRepostByUserIdandPostId(userId, postId) {
  return db.query(`SELECT * FROM reposts WHERE "userId" = $1 AND "postId" = $2;`, [userId, postId]);
}

async function insertRepost({ userId, postId }) {
  return db.query(`INSERT INTO reposts ("userId", "postId") VALUES ($1,$2);`, [userId, postId]);
}

const insertCommentOnPost = ({ postId, userId, content }) => {
  return db.query(`INSERT INTO comments ("postId", "userId", content) VALUES ($1, $2, $3);`, [
    postId,
    userId,
    content,
  ]);
};

const getCommentsById = ({ postId }) => {
  return db.query(
    `SELECT comments.id,comments."userId", comments."postId", comments.content,comments."createdAt", users.name, users."profilePic", followers."followerId",
    (
              SELECT
                  COUNT(comments."userId") AS "commentsCount"
              FROM
                 comments
                  JOIN users ON comments."userId" = users.id
              WHERE comments."postId" = $1
            ) AS "commentsCount"
      FROM comments JOIN users ON comments."userId" = users.id
      LEFT JOIN followers ON comments."userId" = followers."followerId"
      WHERE comments."postId" = $1
      GROUP BY comments.id, comments.content,comments."createdAt", users.name,users."profilePic",followers."followerId"
      ORDER BY comments."createdAt" ASC;
      `,
    [postId]
  );
};

export {
  postInsertion,
  insertLinkMetadata,
  insertPostVisits,
  getPostsWithLimitAndOffset,
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
  getRepostByUserId,
  getRepostByUserIdandPostId,
  insertCommentOnPost,
  getCommentsById,
};
