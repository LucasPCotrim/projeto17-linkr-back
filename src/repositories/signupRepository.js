import connection from "../database/database.js";

async function checkIfUserExists(email) {
  return await connection.query(`SELECT email FROM users WHERE email = ($1);`, [
    email,
  ]);
}

async function createUser(name, email, hashPassword, profilePic) {
  return connection.query(
    `INSERT INTO users (name, email, password, "profilePic") VALUES($1, $2, $3, $4);`,
    [name, email, hashPassword, profilePic]
  );
}

export { checkIfUserExists, createUser };
