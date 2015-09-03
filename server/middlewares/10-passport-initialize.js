import passport from 'koa-passport';
import User from '../models/user';
import initStrategies from '../modules/strategies';

initStrategies();

passport.serializeUser(function(user, done) {
    done(null, user.id); // uses _id as idFieldd
});

passport.deserializeUser(function(id, done) {
    //done(null, { id: 1, username: 'test' });
    User.findById(id, done); // callback version checks id validity automatically
});

export default passport.initialize();
