const { ExtractJwt, Strategy } = require('passport-jwt');
const User = require('mongoose').model('User');

require('dotenv').config()

/**
 * see https://www.passportjs.org/packages/passport-jwt/ for exploring this options object
 * 
 * The ExtractJwt class expects that our jwt token comes as "Bearer ytbnalvfdlg" in Authorization header
 */
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: process.env.AUTH_SECRET 
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
    console.log(payload.sub)
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