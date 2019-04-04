const express = require('express')
require('dotenv').config()
const massive = require('massive')
const session = require('express-session')
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./../server/middleware/authMiddleware')


const app = express()

const { CONNECTION_STRING, SERVER_PORT, SESSION_SECRET } = process.env

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db set')
})

app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}))

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)

app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.post('/api/treasure/all', auth.usersOnly, treasureCtrl.getAllTreasure)


app.listen(SERVER_PORT, () => console.log(`listening on ${SERVER_PORT}`))