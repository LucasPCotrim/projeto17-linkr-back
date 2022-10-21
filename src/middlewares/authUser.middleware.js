import sessionRepository from "../repositories/sessions.repository.js";
import jwt from "jsonwebtoken";

async function verificaToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const user = await sessionRepository.getSessionByUserId(decoded.id);

    if (user.rowCount === 0) {
      return res.sendStatus(404);
    }

    res.locals.user = decoded;
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }

  next();
}

export default verificaToken;
