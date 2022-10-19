import connection from "../database/database.js";

async function getUserByEmail(email) {
  return connection.query(`SELECT * FROM users WHERE email = $1;`, [email]);
}

async function insertSessions({ userId, token }) {
  return connection.query(
    `INSERT INTO sessions ("userId", token) VALUES ($1, $2);`,
    [userId, token]
  );
}

export { getUserByEmail, insertSessions };
