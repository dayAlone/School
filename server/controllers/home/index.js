import Router from 'koa-router';
//import React from 'react';
//import App from '../../../client/js/';

export default function(app) {
    const router = new Router();
    router
        .get('*', function* () {
                this.body = this.render('index');
            });
    app.use(router.routes());
};
