const fs = require('fs');
const { ExtractJwt, Strategy } = require('passport-jwt');
const path = require('path');
const User = require('mongoose').model('User');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


/**
 * see https://www.passportjs.org/packages/passport-jwt/ for exploring this options object
 * 
 * The ExtractJwt class expects that our jwt token comes as "Bearer ytbnalvfdlg" in Authorization header
 */
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

/**
 * this strategy is the same as JwtStrategy used in examples
 * 
 * This class will decode the jwt and return the payload
 * 
 * You can use any kind of verification. Here, I searched the user in
 * the database based on the sub field, which is my user id that I 
 * defined in the payload that I send (routes/user.js)
 */
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