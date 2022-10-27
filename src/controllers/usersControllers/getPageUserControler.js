import usersRepository from '../../repositories/usersRepository.js';

async function getPageUser(req, res) {
  const userId = parseInt(req.params.id) > 0 ? req.params.id : 0;
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  try {
    const postsUser = await usersRepository.getPostByUserId({ userId, limit, offset });
    return res.status(200).send(postsUser.rows);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
}

export default getPageUser;
