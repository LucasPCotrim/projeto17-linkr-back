import {
  insertFollower,
  deleteFollower,
} from "../repositories/followRepository.js";

async function checkFollow(req, res) {
  const { follows } = res.locals;

  res.status(200).send({ follows: follows });
}

async function registerFollower(req, res) {
  const { userId, followerId } = req.body;

  await insertFollower(userId, followerId);

  res.sendStatus(201);
}

async function unfollow(req, res) {
  const { followerId } = req.query;
  const { userId } = req.params;

  await deleteFollower(userId, followerId);

  res.sendStatus(200);
}

export { checkFollow, registerFollower, unfollow };
