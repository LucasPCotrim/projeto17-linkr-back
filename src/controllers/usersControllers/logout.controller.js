import sessionsRepository from '../../repositories/sessions.repository.js'

async function logout(req, res) {
    const userId = res.locals.user.id;

    try {
        await sessionsRepository.logoutUser(userId);
        return res.sendStatus(200);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

export default logout;