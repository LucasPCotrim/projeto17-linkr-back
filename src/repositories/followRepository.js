import connection from "../database/database.js";

async function checkIfUserIsFollowingAnotherUser(userId, followerId) {
  return await connection.query(
    `SELECT * FROM followers f
  WHERE f."userId" = $1 
  AND f."followerId" = $2;`,
    [userId, followerId]
  );
}

async function insertFollower(userId, followerId) {
  console.log(userId, followerId);
  return await connection.query(
    `INSERT INTO followers ("userId", "followerId") 
  VALUES ($1, $2);`,
    [userId, followerId]
  );
}

async function deleteFollower(userId, followerId) {
  return await connection.query(
    `DELETE FROM followers f
    WHERE f."userId" = $1 
    AND f."followerId" = $2;`,
    [userId, followerId]
  );
}

export { checkIfUserIsFollowingAnotherUser, insertFollower, deleteFollower };
