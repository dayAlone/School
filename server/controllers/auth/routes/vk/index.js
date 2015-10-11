import Router from 'koa-router';
import passport from 'koa-passport';
import addProviderRoute from '../../lib/addProviderRoute';

const router = new Router();
router
    .get('/login/', passport.authenticate('vkontakte', {scope: ['email'], display: 'popup'}))
    .get('/callback/', addProviderRoute('vkontakte', passport));

export default router.routes();
