if (process.env.NODE_ENV !== 'production') { require('./libs/trace'); }

import koa from 'koa';
import config from 'config';
import './libs/mongoose';

import initMiddlewares from './middlewares';
import initControllers from './controllers';

const app = koa();
app.keys = [config.secret];

initMiddlewares(app);
initControllers(app);

app.listen(3000);
