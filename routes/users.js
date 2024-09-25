const mongoose = require('mongoose');
const User = mongoose.model('User');

const router = require('express').Router();   
const bcrypt = require('bcrypt');
const fs = require('fs')
const path = require('path');
const jwt = require('jwt-simple');

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

router.get('/protected', (req, res, next) => {
});

function issueJWT(user){
    const now = Math.floor(Date.now() / 1000);

    const payload = {
        sub: user._id,
        name: user.username,
        iat: now,
        exp: now + (60 * 60 * 24)
    };

    return {
        payload,
        token: jwt.encode(payload, PRIV_KEY)
    };
}

router.post('/login', (req, res, next)=>{
    User.findOne({username: req.body.username})
        .then(user => {
            if (!user) return res.status(401).json({error: 'Invalid username or password'});

            bcrypt.compare(req.body.password, user.password)
               .then(isMatch => {
                    if (!isMatch) return res.status(401).json({error: 'Invalid username or password'});

                    const jwt = issueJWT(user);

                    res.json({...jwt.payload, token: jwt.token});
                })
               .catch(err => res.status(500).send(err))
        })
});

router.post('/register', async (req, res, next) => {
    const hash_password = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
        username: req.body.username,
        password: hash_password
    })

    newUser.save()
        .then( user => {
            const jwt = issueJWT(user);
            res.json({...jwt.payload, token: jwt.token})
        })
        .catch(err => res.status(500).send(err))
});

module.exports = router;