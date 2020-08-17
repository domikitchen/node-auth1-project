const router = require('express').Router();

const Users = require('../data/db-config.js');

router.get('/', (req, res) => {
    Users('users').select('username', 'email').orderBy('usersId')
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            res.status(500).json({ error: "Something went wrong while retreiving the users" });
        })
});

module.exports = router;