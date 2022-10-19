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

const usersRepository = {
  getUserbyId, createUser, getUserbyName
}

export default usersRepository