import sessionRepository from "../repositories/sessionsRepository.js";
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
    res.locals.token = token;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.send("token expirado").status(401);
    }
    console.error(err);
    return res.sendStatus(500);
  }

  next();
}

export default verificaToken;
