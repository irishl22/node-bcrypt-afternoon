module.exports = {
    usersOnly: (req, res, next) => {
        const { user } = req.session
        if(!user) {
            res.status(401).send('Please login')
        }
        next()
    },
    adminsOnly: (req, res, next) => {
        if(!req.session.user) {
            res.status(403).send('Not Admin')
        }
        next()
    }
}