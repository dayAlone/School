if (process.env.NODE_ENV !== 'production') { require('./libs/trace'); }

import koa from 'koa';
import fs from 'fs';
import path from 'path';
import config from 'config';
import mongoose from './libs/mongoose';
import router from './routes/';

const app = koa();
app.keys = [config.secret];

//require('koa-locals')(app);

const middlewares = fs.readdirSync(path.join(path.dirname(), './server/middlewares')).sort();

middlewares.forEach((middleware) => {
    const data = require(`./middlewares/${middleware}`);
    const use = (func) => {
        if (typeof func === 'function') app.use(func);
    };
    if (typeof data === 'object' && data.length > 0) {
        data.forEach(elem => {
            use(elem);
        });
    } else use(data);
});

app
    .use(router)
    .listen(3000);
