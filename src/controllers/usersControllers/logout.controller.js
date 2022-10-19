import sessionsRepository from '../../repositories/sessions.repository.js'

async function logout (req, res) {
    const userId = res.locals.user.id;
    
    try {
        await sessionsRepository.logoutUser(userId);
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

export default logout;