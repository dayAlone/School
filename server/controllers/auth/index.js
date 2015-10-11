import User from '../../models/user';
import passport from 'koa-passport';
import routes from './routes';
import './strategies';

export default function(app) {
    passport.serializeUser(function(user, done) {
            done(null, user.id); // uses _id as idFieldd
        });
    passport.deserializeUser(function(id, done) {
            //done(null, { id: 1, username: 'test' });
            User.findById(id, done); // callback version checks id validity automatically
        });
    app
        .use(passport.initialize())
        .use(passport.session())
        .use(routes);
}
