import usersRepository from "../../repositories/usersRepository.js";

async function getPageUser(req, res) {
  const userId = parseInt(req.params.id) > 0 ? req.params.id : 0;
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;
  try {
    const PostUser = await usersRepository.getPostByUserId(userId, limit, offset);
    if (PostUser.rowCount > 0) {
      return res.send(PostUser.rows).status(200);
    }
    return res.sendStatus(404);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
}

export default getPageUser;