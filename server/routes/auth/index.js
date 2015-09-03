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
    .post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/'
        }));
export default router.routes();
