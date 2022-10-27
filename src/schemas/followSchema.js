import Joi from "joi";
const validateSchema = (schema) => (payload) => schema.validate(payload);

const followSchema = Joi.object({
  userId: Joi.number().empty().required().messages({
    "number.empty": "userId cannot be an empty field",
    "any.required": "userId is required",
  }),
  followerId: Joi.number().empty().required().messages({
    "number.empty": "followerId cannot be an empty field",
    "any.required": "followerId is required",
  }),
});

const followValidation = validateSchema(followSchema);

export { followValidation };
