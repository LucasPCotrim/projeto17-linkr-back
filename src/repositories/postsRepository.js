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

async function getPostsWithUserAndMetadata({ limit }) {
  return db.query(
    `SELECT
      posts.id,
      posts.url,
      posts.content,
      json_build_object('name', users.name, 'email', users.email, 'profilePic', users."profilePic") AS "user",
      json_build_object('image', metadata.image, 'title', metadata.title, 'description', metadata."description") AS "metadata"
    FROM
      posts
      JOIN users ON posts."userId" = users.id
      JOIN metadata ON posts."metadataId" = metadata.id
    ORDER BY posts."createdAt" DESC
    LIMIT $1`,
    [limit]
  );
}

export {
  postInsertion,
  insertLinkMetadata,
  getPostsWithUserAndMetadata,
  hashtagInsertion,
  hashtagsPostsInsertion,
  selectHashtag,
};
