const mongoose = require('mongoose');
const User = mongoose.model('User');

const router = require('express').Router();   
const bcrypt = require('bcrypt');
const fs = require('fs')
const path = require('path');
const jwt = require('jwt-simple')

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

router.get('/protected', (req, res, next) => {
});

router.post('/login', (req, res, next)=>{});

router.post('/register', async (req, res, next) => {
    const hash_password = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
        username: req.body.username,
        password: hash_password
    })

    newUser.save()
        .then( user => {
            const now = Math.floor(Date.now() / 1000)

            const payload = {
                sub: user._id,
                name: user.username,
                iat: now,
                exp: now + (60 * 60 * 24) // 1 day
            };

            res.json({
                ...payload,
                token: jwt.encode(payload, PRIV_KEY)
            })
        })
        .catch(err => res.status(500).send(err))
});

module.exports = router;