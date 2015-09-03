import Router from 'koa-router';

import fs from 'fs';
const routes = fs.readdirSync(__dirname).filter(file => { return !['index.js'].includes(file); }).sort();

let router = new Router();

router
    .get('/', function* () {
            this.session.messages = this.session.messages || [];
            this.body = this.render('index', {auth: this.isAuthenticated(), messages: this.session.messages});
            delete this.session.messages;
        });

routes.forEach(route => {
    const func = require(`./${route}`);
    if (typeof func === 'function') router.use(`/${route}`, func);
});

export default router.routes();
