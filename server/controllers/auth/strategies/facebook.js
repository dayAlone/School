import config from 'config';
import authenticateByProfile from '../lib/authenticateByProfile';
import { Strategy as FacebookStrategy } from 'passport-facebook';

export default new FacebookStrategy({
    clientID: config.get('facebook.client.id'),
    clientSecret: config.get('facebook.client.secret'),
    callbackURL: config.get('facebook.callback.url'),
    profileFields: ['id', 'verified', 'name', 'displayName', 'link', 'picture.type(large)', 'email', 'gender'],
    passReqToCallback: true
},
(req, accessToken, refreshToken, params, profile, done) => {

    if (!profile._json.verified) {
        return done(null, false, {message: 'Почта на facebook должна быть подтверждена'});
    }

    if (!profile.emails || !profile.emails[0]) { // user may allow authentication, but disable email access (e.g in fb)
        return done(null, false, {message: 'При входе разрешите доступ к эл. почте. Она используется для идентификации пользователя.'});
    }

    profile.realName = profile._json.name;
    if (profile._json.picture && profile._json.picture.data.url.length > 0) {
        profile.photos = [{
            value: profile._json.picture.data.url
        }];
    }

    authenticateByProfile(req, profile, done);

});
