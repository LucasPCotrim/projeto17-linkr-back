import connection from '../database/database.js';

async function createUser(name, email, password, profilePic) {
  return await connection.query(`
    INSERT INTO users 
    	(name, email, password, "profilePic") 
    	VALUES ($1, $2, $3, $4);`,
    [name, email, password, profilePic])
}

async function getUserbyId(userId) {
  return await connection.query(`SElECT * FROM users WHERE id = $1;`,
    [userId]
  );
}

async function getUsersbyName(userId, stringName, limit) {
  stringName += '%';
  return await connection.query(`
    SElECT us.*,
      COALESCE (COUNT(f."id"), 0) AS "follow"
        FROM users "us"
        LEFT JOIN (SELECT * FROM followers WHERE "userId" = $1) f ON f."followerId" = us.id
      WHERE us.name ILIKE $2
      GROUP BY us.id
		  ORDER BY follow DESC, name
      LIMIT $3;`,
    [userId, stringName, limit]
  );
}

async function getPostByUserId(userId, limit) {
  return await connection.query(
    `SELECT
      "p"."id" AS "id",
      "p"."url",
      "p"."content",
      json_build_object('name', "u"."name", 'email', "u"."email", 'profilePic', "u"."profilePic", 'id', "u"."id") AS "user",
      json_build_object('image', "m"."image", 'title', "m"."title", 'description', "m"."description") AS "metadata",
      ARRAY(
        SELECT
          json_build_object('name', "ul"."name", 'email', "ul"."email")
        FROM
          posts "pl"
          LEFT JOIN likes "ll" ON ll."postId" = "pl"."id"
          JOIN users "ul" ON "ul"."id" = "ll"."userId"
        WHERE "ll"."postId" = "p"."id"
        ORDER BY "ll"."createdAt" DESC
      )
      AS "usersWhoLiked",
      COALESCE ("v"."count", 0) AS "visitCount"
    FROM
      posts "p"
      JOIN users "u" ON "p"."userId" = "u"."id"
      JOIN metadata "m" ON "p"."metadataId" = "m"."id"
      LEFT JOIN visits "v" ON "v"."postId" = "p"."id"
		WHERE "u"."id" = $1
    ORDER BY "p"."createdAt" DESC
    LIMIT $2;`,
    [userId, limit]
  );
}

async function followUser(userId, followerId) {
  return await connection.query(
    `SELECT * FROM followers f
      WHERE f."userId" = $1 
      AND f."followerId" = $2;`,
    [userId, followerId]
  );
}

async function follow(userId, followerId) {
  return await connection.query(
    `INSERT INTO followers ("userId", "followerId") 
      VALUES ($1, $2);`,
    [userId, followerId]
  );
}

async function unFollowUser(userId, followerId) {
  return await connection.query(
    `DELEE FROM followers f
        WHERE f."userId" = $1 
        AND f."followerId" = $2;`,
    [userId, followerId]
  );
}

const usersRepository = {
  getUserbyId, createUser, getUsersbyName, getPostByUserId
}

export default usersRepository