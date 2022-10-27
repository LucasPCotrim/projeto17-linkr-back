import { followValidation } from "../schemas/followSchema.js";
import { checkIfUserIsFollowingAnotherUser } from "../repositories/followRepository.js";

const validateFollow = async (req, res, next) => {
  const { followerId } = req.query;
  const { userId } = req.params;

  console.log(userId, followerId);

  if (!userId || !followerId) return res.sendStatus(422);

  try {
    const isFollowing = await checkIfUserIsFollowingAnotherUser(
      userId,
      followerId
    );
    let follows;

    if (isFollowing.rows.length === 0) {
      follows = false;
    } else {
      follows = true;
    }

    res.locals.follows = follows;

    next();
  } catch (error) {
    res.sendStatus(500);
  }
};

const followValidator = async (req, res, next) => {
  const validate = followValidation(req.body, {
    abortEarly: false,
  });

  if (validate.error) {
    const errors = validate.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }

  const { userId, followerId } = req.body;

  if (!userId || !followerId) return res.sendStatus(422);

  try {
    const isFollowing = await checkIfUserIsFollowingAnotherUser(
      userId,
      followerId
    );

    if (isFollowing.rows.length > 0) {
      return res.status(409).send("Already following");
    }

    next();
  } catch (error) {
    res.sendStatus(500);
  }
};

export { validateFollow, followValidator };
