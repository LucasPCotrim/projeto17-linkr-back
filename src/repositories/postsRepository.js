import db from "../database/database.js";

const postInsertion = ({ url, content, userId }) => {
  return db.query(
    `INSERT INTO posts (url,content,"userId") VALUES ($1, $2, $3);`,
    [url, content, userId]
  );
};

export { postInsertion };
