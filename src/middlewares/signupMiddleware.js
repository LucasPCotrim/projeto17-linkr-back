import { signUpValidation } from "../schemas/signupSchema.js";
import { checkIfUserExists } from "../repositories/signupRepository.js";

const signUpValidator = async (req, res, next) => {
  const validate = signUpValidation(req.body, {
    abortEarly: false,
  });

  if (validate.error) {
    const errors = validate.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }

  const { email } = req.body;

  try {
    const validEmail = await checkIfUserExists(email);

    if (validEmail.rows[0]) return res.status(409).send("Email already exists");

    next();
  } catch (error) {
    res.sendStatus(500);
  }
};

export { signUpValidator };
