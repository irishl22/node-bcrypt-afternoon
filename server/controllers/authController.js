const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const { username, password, isAdmin } = req.body
        const db = req.app.get('db')

        let response = await db.get_user(username)
        let existingUser = response[0]

        if(existingUser) {
            res.status(409).send('Username Taken')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        let result = await db.register_user([isAdmin, username, hash])
        const user = result[0]

        req.session.user = { isAdmin: user.is_admin, username: user.username, id: user.id}
        return res.status(201).send(req.session.user)

    },
    login: async (req, res) => {
        const { username, password } = req.body
        const db = req.app.get('db')
        let foundUser = await db.get_user([username])
        const user = foundUser[0]

        if(!user) {
            res.status(401).send('User not found, plz register')
        }

        const isAuthenticated = bcrypt.compareSync(password, user.hash)

        if(!isAuthenticated) {
            res.status(403).send('Incorrect Password')
        }

        req.session.user = { isAdmin: user.is_admin, username: user.username, id: user.id}
        console.log(req.session.user)
        return res.status(201).send(req.session.user)
    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}