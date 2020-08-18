const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');
const protected = require('../auth/protected.js');
const dbConnection = require('../data/db-config.js');

const server = express();

const sessionConfiguration = {
    name: 'owo',
    secret: 'uwu',
    cookie: {
      maxAge: 1000 * 60 * 5,
      secure: process.env.COOKIE_SECURE || false,
      httpOnly: true,
    },
    resave: false,
    saveUninitalized: false,
    store: new KnexSessionStore({
      knex: dbConnection,
      tablename: 'sessions',
      sidfielname: 'sid',
      createtable: true,
      clearInterval: 1000 * 60 * 20,
    })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfiguration));

server.use('/api/users', protected, usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.send(`<h2>go somewhere else</h2>`);
})

module.exports = server;