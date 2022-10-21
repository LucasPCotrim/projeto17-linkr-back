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
      posts.id,
      posts.url,
      posts.content,
      json_build_object('name', users.name, 'email', users.email, 'profilePic', users."profilePic") AS "user",
      json_build_object('image', metadata.image, 'title', metadata.title, 'description', metadata."description") AS "metadata"
    FROM
      posts
      JOIN users ON posts."userId" = users.id
      JOIN metadata ON posts."metadataId" = metadata.id
		WHERE users.id = $1
    ORDER BY posts."createdAt" DESC
    LIMIT $2`,
		[userId, limit]
	);
}

const usersRepository = {
	getUserbyId, createUser, getUserbyName, getPostByUserId
}

export default usersRepository