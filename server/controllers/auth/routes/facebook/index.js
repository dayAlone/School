import Router from 'koa-router';
import passport from 'koa-passport';

const router = new Router();
router
    .get('/login/', passport.authenticate('facebook'))
    .get('/callback/', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

export default router.routes();
