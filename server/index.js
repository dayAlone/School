require('dotenv').config();
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

console.log(process.env.X);

app.listen(process.env.NODE_ENV === 'production' ? ( process.env.PORT ? process.env.PORT : 80 ) : 3000);
