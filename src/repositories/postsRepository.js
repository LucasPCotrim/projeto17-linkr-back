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

async function getRecentPosts({ limit }) {
  return db.query(
    `SELECT
      "p"."id" AS "id",
      "p"."url",
      "p"."content",
      json_build_object('name', "u"."name", 'email', "u"."email", 'profilePic', "u"."profilePic") AS "user",
      json_build_object('image', "m"."image", 'title', "m"."title", 'description', "m"."description") AS "metadata",
      ARRAY(
        SELECT
          json_build_object('name', "ul"."name", 'email', "ul"."email")
        FROM
          posts "pl"
          LEFT JOIN likes "ll" ON ll."postId" = "pl"."id"
          JOIN users "ul" ON "ul"."id" = "ll"."userId"
        WHERE "ll"."postId" = "p"."id"
      ) AS "usersWhoLiked",
      COALESCE("v"."count", 0) AS "visitCount"
    FROM
      posts "p"
      JOIN users "u" ON "p"."userId" = "u"."id"
      JOIN metadata "m" ON "p"."metadataId" = "m"."id"
      LEFT JOIN visits "v" ON "v"."postId" = "p"."id"
    ORDER BY p."createdAt" DESC
    LIMIT $1;`,
    [limit]
  );
}

async function getPostById(postId) {
  return db.query(`SELECT * FROM posts WHERE id = $1;`, [postId]);
}

async function updateContentPost(postId, content) {
  return db.query(`UPDATE posts SET content = $1 WHERE posts.id = $2;`, [content, postId]);
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
};
