import sessionRepository from '../repositories/sessions.repository.js'
import userRepository from '../repositories/users.repository.js'

async function verificaToken(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');
    if (!token) {
        return res.sendStatus(401);
    }
    try {
        const session = await sessionRepository.getSession(token);
        if (session.rowCount === 0) {
            return res.sendStatus(401);
        }

        const user = await userRepository.getUserbyId(session.rows[0].userId);

        if (user.rowCount === 0) {
            return res.sendStatus(404);
        }
        
        res.locals.user = user.rows[0];
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }

    next();
}

export default verificaToken;