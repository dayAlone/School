import User from '../../../models/user';
import co from 'co';
import { Strategy as LocalStrategy } from 'passport-local';

function UserAuthError(message) { this.message = message; }

export default new LocalStrategy(
        {usernameField: 'email', passwordField: 'password'},
        (email, password, done) => {
            co(function* () {
                // anti-bruteforce pause
                yield callback => { setTimeout(callback, 100); };

                let user = yield User.findOne({email: email}).exec();

                if (!user) throw new UserAuthError('Мы хорошо поискали, c таким электронным ящиком у нас еще не регистрировались.');

                let name = user.realName.split(' ')[0];

                if (!user.checkPassword(password)) throw new UserAuthError(`${name ? name +', п' : 'П' }ароль не подходит, попробуй еще раз.`);

                return user;
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
    );
