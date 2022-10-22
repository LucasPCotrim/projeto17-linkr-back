import { checkIfHashtagExists } from "../repositories/hashtagRepository.js";

const validHashtag = async (req, res, next) => {
  const { hashtag } = req.params;
  if (!hashtag) return res.sendStatus(422);

  try {
    const selectHashtag = await checkIfHashtagExists(hashtag);

    if (selectHashtag.rows.length === 0)
      return res.status(404).send("Not found");
  } catch (error) {
    res.sendStatus(500);
  }

  next();
};

export { validHashtag };
