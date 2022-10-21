import { postValidator } from "../schemas/postsSchemas.js";

const postValidation = (req, res, next) => {
  const { error } = postValidator(req.body);
  if (error) return res.status(422).send(error.message);

  next();
};
export { postValidation };
