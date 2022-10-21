import connection from "../database/database.js";

async function createSession(userId, token) {
  return await connection.query(
    `
		INSERT INTO sessions 
			("userId", token) 
			VALUES ($1, $2);`,
    [userId, token]
  );
}

async function getSession(token) {
  return await connection.query(
    `
    SElECT * FROM sessions WHERE token = $1;`,
    [token]
  );
}

async function logoutUser(userId) {
  return await connection.query(
    `
    DELETE FROM sessions WHERE "userId"=$1;`,
    [userId]
  );
}

async function getSessionByUserId(userId) {
  return await connection.query(`SELECT * FROM sessions WHERE "userId" = $1;`, [
    userId,
  ]);
}

const sessionRepository = {
  createSession,
  getSession,
  logoutUser,
  getSessionByUserId,
};

export default sessionRepository;
