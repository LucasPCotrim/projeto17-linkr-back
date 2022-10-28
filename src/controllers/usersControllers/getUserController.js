import usersRepository from "../../repositories/usersRepository.js";

async function getUser(req, res) {
  const userId = parseInt(req.params.id) > 0 ? req.params.id : res.locals.user.id;
  try {
    const user = await usersRepository.getUserbyId(userId);
    return res.send(user.rows[0]).status(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
}

export default getUser;