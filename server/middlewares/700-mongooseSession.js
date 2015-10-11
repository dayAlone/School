import mongoose from '../libs/mongoose';
import { expires } from 'config';
import session from 'koa-generic-session';
import mongooseStore from 'koa-session-mongoose';

export default session({
    ttl: expires,
    store: mongooseStore.create({
        connection: mongoose,
        model: 'Session',
        collection: 'sessions',
        expires: expires
    })
});
