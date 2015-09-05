import config from 'config';
import passport from 'koa-passport';
import User from '../../../models/user';
import { Strategy as FacebookStrategy } from 'passport-facebook';

export default function() {
    passport.use(new FacebookStrategy({
            clientID: config.get('facebook.client.id'),
            clientSecret: config.get('facebook.client.secret'),
            callbackURL: config.get('facebook.callback.url'),
            profileFields: ['id', 'displayName', 'link', 'picture.type(large)', 'email'],
            passReqToCallback: true
        },
        (req, accessToken, refreshToken, profile, done) => {
            //console.log(profile._json.picture.data.url);
            process.nextTick(() => {
                let data = {
                    id: profile.id,
                    token: accessToken,
                    profile: profile.profileUrl
                };

                User.findOne({
                    'email': profile.emails[0].value
                },
                (err, user) => {
                    if (err) return done(err);
                    if (user) {
                        if (!user.social.facebook.length) {
                            user.social.facebook = data;
                            user.save(() => {
                                done(null, user);
                            });
                        } else return done(null, user);
                    } else {
                        user = {
                            displayName: profile.displayName,
                            email: profile.emails[0].value,
                            social: {
                                facebook: data
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
