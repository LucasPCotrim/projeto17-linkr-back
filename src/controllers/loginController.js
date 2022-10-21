import bcrypt from "bcrypt";
import { loginSchema } from "../schemas/loginSchema.js";
import {
  getUserByEmail,
  insertSessions,
} from "../repositories/loginRepository.js";
import jwt from "jsonwebtoken";

async function login(req, res) {
  const { email, password } = req.body;

  const validation = loginSchema.validate(
    { email, password },
    { abortEarly: false }
  );

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }
  try {
    const user = await getUserByEmail(email);
    if (user.rowCount === 0) {
      return res.sendStatus(401);
    }
    const passwordValid = bcrypt.compareSync(password, user.rows[0].password);
    if (!passwordValid) {
      return res.sendStatus(401);
    }
    const token = jwt.sign(
      {
        name: user.rows[0].name,
        id: user.rows[0].id,
        profilePic: user.rows[0].profilePic,
      },
      process.env.SECRET_TOKEN,
      { expiresIn: 7200 }
    );

    await insertSessions({ userId: user.rows[0].id, token });
    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export { login };
