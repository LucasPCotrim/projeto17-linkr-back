import connection from '../database/database.js';

async function createUser(name, email, password, profilePic) {
  return await connection.query(
    `
    INSERT INTO users 
    	(name, email, password, "profilePic") 
    	VALUES ($1, $2, $3, $4);`,
    [name, email, password, profilePic]
  );
}

async function getUserbyId(userId) {
  return await connection.query(`SElECT * FROM users WHERE id = $1;`, [userId]);
}

async function getUsersbyName(userId, stringName, limit) {
  stringName += '%';
  return await connection.query(
    `
    SELECT us.*,
      COALESCE (COUNT(f."id"), 0) AS "follow"
        FROM users "us"
        LEFT JOIN (SELECT * FROM followers WHERE "followerId" = $1) f ON f."userId" = us.id
      WHERE us.name ILIKE $2
      GROUP BY us.id
		  ORDER BY follow DESC, name
      LIMIT $3;`,
    [userId, stringName, limit]
  );
}

async function getPostByUserId(userId, limit, offset) {
  return await connection.query(
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
        WHERE "u"."id" = $1
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

async function followUser(userId, targetUser) {
  return await connection.query(
    `SELECT * FROM followers f
      WHERE f."userId" = $1 
      AND f."followerId" = $2;`,
    [targetUser, userId]
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
  getUserbyId,
  createUser,
  getUsersbyName,
  getPostByUserId,
};

export default usersRepository;
