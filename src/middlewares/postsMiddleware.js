import { postValidator } from "../schemas/postsSchemas.js";

const postValidation = (req, res, next) => {
  const { error } = postValidator(req.body);
  if (error) return res.status(422).send(error.message);

  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);
  next();
};
export { postValidation };
