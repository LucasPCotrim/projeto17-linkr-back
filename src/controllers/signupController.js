import { createUser } from "../repositories/signupRepository.js";
import bcrypt from "bcrypt";

async function signUp(req, res) {
  const { name, email, password, profilePic } = req.body;

  const hashPassword = bcrypt.hashSync(password, 10);

  try {
    createUser(name, email, hashPassword, profilePic);

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}

export { signUp };
