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

async function getUserbyName(stringName) {
	stringName += '%';
	return await connection.query(`SElECT * FROM users WHERE name ILIKE $1;`,
		[stringName]
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

const usersRepository = {
	getUserbyId, createUser, getUserbyName, getPostByUserId
}

export default usersRepository