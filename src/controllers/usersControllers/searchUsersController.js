import usersRepository from "../../repositories/usersRepository.js";

async function getUsersbyName(req, res) {
  const { stringName } = req.params?.stringName !== "allusers" ? req.params : { stringName: "" };
  const limit = req.query.limit || 20;
  const userId = res.locals.user.id;
  try {
    const listUsers = await usersRepository.getUsersbyName(userId, stringName, limit);
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