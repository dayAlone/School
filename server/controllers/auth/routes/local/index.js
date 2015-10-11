import Router from 'koa-router';
import passport from 'koa-passport';
const router = new Router();
router
    .post('/login', function* (next) {
        let ctx = this;
        yield passport.authenticate('local', {badRequestMessage: 'Заполните, пожалуйста, оба поля.'},
        function* (err, user, info) {
            if (err) throw err;
            if (user) {
                yield ctx.login(user);
            }
            switch (ctx.request.accepts('json', 'html', 'text')) {
                case 'json':
                    if (info) {
                        ctx.body = {error: info.message};
                    } else {
                        ctx.body = user;
                    }
                break;

                case 'text':
                case 'html':
                    if (info && info.message.length > 0) {
                        ctx.session.messages = ctx.session.messages || [];
                        ctx.session.messages.push(info.message);
                    }
                    ctx.redirect('/');
                break;

                default: this.throw(406, 'json, html, or text only');
            }

        }).call(this, next);
    })
    .get('/login', function* () {
        this.redirect('/');
    });

export default router.routes();
