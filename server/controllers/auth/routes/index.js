import Router from 'koa-router';
import fs from 'fs';

const routes = fs.readdirSync(__dirname).filter(file => { return !['index.js'].includes(file); }).sort();
const router = new Router({prefix: '/auth'});

routes.forEach(route => {
    const func = require(`./${route}`);
    if (typeof func === 'function') router.use(`/${route}`, func);
});

router
.get(`/check`, function*() {
    this.body = { user: this.req.user ? this.req.user : false };
})
.get('/logout', function* () {
    this.logout();
    this.redirect('/');
});

export default router.routes();
