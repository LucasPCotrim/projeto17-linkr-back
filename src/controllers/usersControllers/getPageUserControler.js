import usersRepository from "../../repositories/usersRepository.js";


async function getPageUser(req, res) {
  const userId = req.params.id;
  const limit = req.query.limit || 20;
  try {
    const PostUser = await usersRepository.getPostByUserId(userId, limit);
    if (PostUser.rowCount === 0) {
      return res.sendStatus(404);
    }
    return res.send(PostUser.rows).status(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
}

export default getPageUser;