import { postInsertion } from "../repositories/postsRepository.js";

const publishPost = async (req, res) => {
  try {
    const { url, content } = req.body;

    const insertedPost = await postInsertion({ url, content, userId: 1 });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export { publishPost };
