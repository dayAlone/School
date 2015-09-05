import Router from 'koa-router';
import passport from 'koa-passport';

const router = new Router();
router
    .get('/login/', passport.authenticate('vkontakte', {scope: ['email']}))
    .get('/callback/', passport.authenticate('vkontakte', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

export default router.routes();
