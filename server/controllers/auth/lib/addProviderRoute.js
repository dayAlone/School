export default function (providerName, passport) {
    return function*(next) {
        var ctx = this;

        yield passport.authenticate(providerName, function*(err, user, info) {
            if (err) throw err;

            if (user) {
                yield ctx.login(user);
            }
            var error = info ? ( info.message ? info.message : info) : false;

            ctx.body = ctx.render('authCallback', { data: JSON.stringify({ error: error, user: user }) }); //ctx.redirect('/');

        }).call(this, next);

    }
}
