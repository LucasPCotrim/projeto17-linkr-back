import db from '../database/database.js';

const postInsertion = ({ url, content, userId }) => {
  return db.query(`INSERT INTO posts (url,content,"userId") VALUES ($1, $2, $3);`, [
    url,
    content,
    userId,
  ]);
};

async function getPostsWithUserAndMetadata({ limit }) {
  return db.query(`
    SELECT
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
    LIMIT ${limit}
  `);
}

export { postInsertion, getPostsWithUserAndMetadata };
