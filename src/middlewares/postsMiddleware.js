import { commentValidator, postValidator } from "../schemas/postsSchemas.js";

const postValidation = (req, res, next) => {
  const { error } = postValidator(req.body);
  if (error) return res.status(422).send(error.message);

  next();
};

const commentValidation = (req, res, next) => {
  const { error } = commentValidator(req.body);
  if (error) return res.status(422).send(error.message);
  next();
};
export { postValidation, commentValidation };
