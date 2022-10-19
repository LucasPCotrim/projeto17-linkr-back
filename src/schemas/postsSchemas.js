import Joi from "joi";
const validator = (schema) => (payload) => schema.validate(payload);

const postsSchema = Joi.object({
  url: Joi.string().uri().required(),
  content: Joi.string().allow("", null),
});

const postValidator = validator(postsSchema);

export { postValidator };
