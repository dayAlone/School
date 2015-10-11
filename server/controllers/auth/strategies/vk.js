import config from 'config';
import authenticateByProfile from '../lib/authenticateByProfile';
import { Strategy as VKontakteStrategy } from 'passport-vkontakte';

export default new VKontakteStrategy({
        clientID: config.get('vk.client.id'),
        clientSecret: config.get('vk.client.secret'),
        callbackURL: config.get('vk.callback.url'),
        passReqToCallback: true,
        profileFields: ['id', 'verified', 'name', 'link', 'photo_max', 'email', 'sex'],
    },
    (req, accessToken, refreshToken, params, profile, done) => {
        process.nextTick(() => {
            // Vkontakte gives email in oauthResponse, not in profile (which is 1 more request)
            if (!params.email) {
                return done(null, false, {message: 'При входе разрешите доступ к эл. почте. Она используется для идентификации пользователя.'});
            }

            profile.emails = [
                {value: params.email}
            ];

            profile.realName = profile.displayName;

            profile.photos = [{
                value: profile.photos[profile.photos.length-1].value
            }];

            authenticateByProfile(req, profile, done);
        });
    });
