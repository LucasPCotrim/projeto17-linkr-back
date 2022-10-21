import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().trim().min(1).required(),
});

export { loginSchema };
