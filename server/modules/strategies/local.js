import User from '../../models/user';
import passport from 'koa-passport';
import co from 'co';
import { Strategy as LocalStrategy } from 'passport-local';

function UserAuthError(message) { this.message = message; }

export default function() {
    passport.use(new LocalStrategy(
        {usernameField: 'email', passwordField: 'password'},
        (email, password, done) => {
            co(function* () {
                // anti-bruteforce pause
                yield callback => { setTimeout(callback, 100); };

                let user = yield User.findOne({email: email}).exec();

                if (!user) throw new UserAuthError('Мы хорошо поискали, но такого пользователя у&nbsp;нас еще не&nbsp;было.');
                if (!user.checkPassword(password)) throw new UserAuthError('Пароль не подходит, попробуй еще раз.');

            })
            .then(user => {
                done(null, user);
            }, err => {
                if (err instanceof UserAuthError) {
                    done(null, false, {message: err.message});
                } else {
                    done(err);
                }

            });
        }
    ));
}
