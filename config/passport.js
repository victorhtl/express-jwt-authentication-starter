const fs = require('fs');
const { ExtractJwt, Strategy } = require('passport-jwt');
const path = require('path');
const User = require('mongoose').model('User');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

/*
// This is all possible options that you may need
const passportJWTOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY || 'secret',
    issuer: 'issuer',
    audience: 'audience',
    algorithms: ['RS256'],
    ignoreExpiration: false,
    passReqToCallback: false,
    jsonWebTokenOptions: {
        complete: false,
        clockTolerance: '',
        maxAge: '2d', // 2 days
        clockTimestamp: '100',
        nonce: 'openId'
    }
};
*/

// This is what we really need
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

const strategy = new Strategy(options, (payload, done) => {
    User.findOne({ _id: payload.sub })
        .then((user)=> {
            if(user){
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => done(err, null));
});

module.exports = (passport) => {
    passport.use(strategy);
}