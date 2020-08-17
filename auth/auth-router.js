const router = require('express').Router();
const bcrypt = require('bcryptjs');

const db = require('../data/db-config.js');

router.post('/signup', (req, res) => {
    const { username, password, email } = req.body;

    const rounds = process.env.HASH_ROUNDS || 5;
    const hash = bcrypt.hashSync(password, rounds);

    db('users').insert({ username, password: hash, email }).returning('usersid')
        .then(usersid => {
            db('users').where({ usersid: usersid }).first()
                .then(user => {
                    res.status(200).json(user);
                })
                .catch(error => {
                    res.status(500).json({ error: error.message });
                });
        })
        .catch(error => {
            res.json({ error: error.message });
        })
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    db('users').where({ username }).orderBy('usersId')
        .then(([user]) => {
            if(user && bcrypt.compareSync(password, user.password)){
                req.session.loggedIn = true;
                res.status(200).json({ henlo: user.username, session: req.session });
            }
            else {
                res.status(401).json({ error: "no" });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        })
})

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(error => {
            if(error) {
                res.status(500).json({ error: "Something went wrong while trying to log you out" });
            }
            else {
                res.status(204).end();
            }
        });
    }
    else {
        res.status(200).json({ message: "Please login to logout" });
    }
})

module.exports = router;