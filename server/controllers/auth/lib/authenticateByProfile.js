import User from '../../../models/user';
import co from 'co';
//const request = require('koa-request');
//import { uploadFile as transload } from 'imgur';

function UserAuthError(message) {
    this.message = message;
}

function* mergeProfile(user, profile) {
    if (!user.photo && profile.photos && profile.photos.length && profile.photos[0].type !== 'default') {
        // assign an avatar unless it's default
        //var photoUrl = profile.photos[0].value;
        //var photoInfo = yield* transload(photoUrl);
        user.photo = profile.photos[0].value;
    }

    if (!user.email && profile.emails && profile.emails.length) {
        user.email = profile.emails[0].value;
    }

    if (!user.displayName && profile.displayName) {
        user.displayName = profile.displayName;
    }

    if (!user.realName && profile.realName) {
        user.realName = profile.realName;
    }

    if (!user.gender && profile.gender) {
        user.gender = profile.gender;
    }

    // remove previous profile from the same provider, replace by the new one
    var nameId = makeProviderId(profile);
    for (var i = 0; i < user.providers.length; i++) {
        var provider = user.providers[i];
        if (provider.nameId === nameId) {
            provider.remove();
            i--;
        }
    }

    user.providers.push({
        name:    profile.provider,
        nameId:  makeProviderId(profile),
        profile: profile
    });

    user.verifiedEmail = true;

}

function makeProviderId(profile) {
    return profile.provider + ':' + profile.id;
}

export default function(req, profile, done) {
    // profile = the data returned by the facebook graph api

    var userToConnect = req.user;

    co(function*() {
        var providerNameId = makeProviderId(profile);

        var user;

        if (userToConnect) {
            // merge auth result with the user profile if it is not bound anywhere yet

            // look for another user already using this profile
            var alreadyConnectedUser = yield User.findOne({
                'providers.nameId': providerNameId,
                _id: {$ne: userToConnect._id}
            }).exec();

            if (alreadyConnectedUser) {

                // before this social login was used by alreadyConnectedUser
                // now we clean the connection to make a new one
                for (var i = 0; i < alreadyConnectedUser.providers.length; i++) {
                    var provider = alreadyConnectedUser.providers[i];
                    if (provider.nameId === providerNameId) {
                        provider.remove();
                        i--;
                    }
                }
                yield alreadyConnectedUser.save();
            }

            user = userToConnect;

        } else {
            user = yield User.findOne({'providers.nameId': providerNameId}).exec();

            if (!user) {
                // if we have user with same email, assume it's exactly the same person as the new man
                user = yield User.findOne({email: profile.emails[0].value}).exec();

                if (!user) {
                    // auto-register
                    user = new User();
                }
            }
        }

        try {
            yield* mergeProfile(user, profile);
        } catch (e) {
            if (e.name === 'BadImageError') { // image too big or kind of
                throw new UserAuthError(e.message);
            } else {
                throw e;
            }
        }

        try {
            yield function(callback) {
                user.validate(callback);
            };
        } catch (e) {
            // there's a required field
            // maybe, when the user was on the remote social login screen, he disallowed something?
            throw new UserAuthError('Недостаточно данных, разрешите их передачу, пожалуйста.');
        }

        yield user.save();

        return user;

    }).then(function(user) {
        done(null, user);
    }, function(err) {
        if (err instanceof UserAuthError) {
            done(null, false, {message: err.message});
        } else {
            done(err);
        }
    });

};
