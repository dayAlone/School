import User from '../../models/user';
import passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';

export default function() {
    passport.use(new LocalStrategy(
        {usernameField: 'email', passwordField: 'password'},
        (email, password, done) => {
            User.findOne({email: email}, function(err, user) {
                if (err) return done(err);

                if (!user || !user.checkPassword(password)) {
                    // don't say whether the user exists
                    return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
                }
                return done(null, user);
            });
        }
    ));
}
