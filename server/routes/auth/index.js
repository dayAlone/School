import Router from 'koa-router';
import passport from 'koa-passport';

const router = new Router();

router.use('/facebook', require('./facebook/'));
router.use('/vk', require('./vk/'));

router
    .get('/logout', function* () {
            this.logout();
            this.redirect('/');
        })
    .post('/login', function* (next) {
        let ctx = this;
        yield passport.authenticate('local', {badRequestMessage: 'Заполните, пожалуйста, оба поля.'},
        function* (err, user, info) {
            if (err) throw err;
            if (info && info.message.length > 0) {
                ctx.session.messages = ctx.session.messages || [];
                ctx.session.messages.push(info.message);
            }
            ctx.redirect('/');
        }).call(this, next);
    })
    .get('/login', function* () {
        this.redirect('/');
    });
export default router.routes();
