import config from 'config';
import passport from 'koa-passport';
import User from '../../models/user';
import { Strategy as VKontakteStrategy } from 'passport-vkontakte';

export default function() {
    passport.use(new VKontakteStrategy({
            clientID: config.get('vk.client.id'),
            clientSecret: config.get('vk.client.secret'),
            callbackURL: config.get('vk.callback.url'),
            passReqToCallback: true
        },
        (req, accessToken, refreshToken, params, profile, done) => {
            process.nextTick(() => {
                let data =  {
                    id: profile.id,
                    token: accessToken,
                    profile: profile.profileUrl
                };

                User.findOne({
                    'email': params.email
                },
                (err, user) => {
                    if (err) return done(err);
                    if (user) {
                        if (!user.social.vk.length) {
                            user.social.vk = data;
                            user.save(() => {
                                done(null, user);
                            });
                        } else return done(null, user);
                    } else {
                        user = {
                            displayName: profile.displayName,
                            email: params.email,
                            social: {
                                vk: data
                            }
                        };
                        const newUser = new User(user);
                        newUser.save((err, user) => {
                            if (err) return done(err);
                            done(null, user);
                        });
                    }
                });
            });

        }
    ));
}
