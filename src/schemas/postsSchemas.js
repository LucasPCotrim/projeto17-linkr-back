import Joi from "joi";
const validator = (schema) => (payload) => schema.validate(payload);

const postsSchema = Joi.object({
  url: Joi.string().uri().required(),
  content: Joi.string().allow("", null),
});

const commentSchema = Joi.object({
  content: Joi.string(),
});

const postValidator = validator(postsSchema);
const commentValidator = validator(commentSchema);

export { postValidator, commentValidator };
