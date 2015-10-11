import Router from 'koa-router';
import passport from 'koa-passport';
import addProviderRoute from '../../lib/addProviderRoute';

const router = new Router();
router
    .get('/login/', passport.authenticate('facebook', {scope: ['email'], display: 'popup'}))
    .get('/callback/', addProviderRoute('facebook', passport));

export default router.routes();
