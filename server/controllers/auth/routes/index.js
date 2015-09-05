import Router from 'koa-router';
import fs from 'fs';

const routes = fs.readdirSync(__dirname).filter(file => { return !['index.js'].includes(file); }).sort();
const router = new Router({prefix: '/auth'});

routes.forEach(route => {
    const func = require(`./${route}`);
    if (typeof func === 'function') router.use(`/${route}`, func);
});

export default router.routes();
