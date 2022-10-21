import sessionsRepository from "../../repositories/sessionsRepository.js";

async function logout(req, res) {
  const token = res.locals.token;
  try {
    await sessionsRepository.logoutUser(token);
    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
}

export default logout;
