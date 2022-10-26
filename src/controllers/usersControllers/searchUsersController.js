import usersRepository from "../../repositories/usersRepository.js";

async function getUsersbyName(req, res) {
  const { stringName } = req.params?.stringName !== "allusers" ? req.params : { stringName: "" };
  const limit = req.query.limit || 20;
  try {
    const listUsers = await usersRepository.getUsersbyName(stringName, limit);
    if (listUsers.rowCount === 0) {
      return res.send([]).status(200);
    }
    return res.send(listUsers.rows).status(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
}

export default getUsersbyName;