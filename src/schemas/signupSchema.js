import Joi from "joi";
const validateSchema = (schema) => (payload) => schema.validate(payload);

const signUpSchema = Joi.object({
  email: Joi.string().email().empty().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email cannot be an empty field",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(3).empty().required().regex(/^\S+$/).messages({
    "string.min": "Password should have at least 3 characters",
    "string.empty": "Password cannot be an empty field",
    "string.pattern.base": "No empty spaces allowed",
    "any.required": "Password is required",
  }),
  name: Joi.string().min(1).empty().required().messages({
    "string.min": "Name should be min 1 character",
    "string.empty": "Name cannot be an empty field",
    "any.required": "Name is required",
  }),

  profilePic: Joi.string()
    .empty()
    .pattern(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)/
    )
    .required()
    .messages({
      "string.empty": "Picture url cannot be an empty field",
      "string.url": "Invalid url format",
      "any.required": "Picture url is required",
      "string.pattern.base":
        "Invalid url! Url must start with http:// or https://",
    }),
});

const signUpValidation = validateSchema(signUpSchema);

export { signUpValidation };
