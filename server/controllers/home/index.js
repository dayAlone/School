import Router from 'koa-router';

export default function(app) {
    const router = new Router();
    router
        .get('/', function* () {
                this.session.messages = this.session.messages || [];
                this.body = this.render('index', {auth: this.isAuthenticated(), messages: this.session.messages});
                delete this.session.messages;
            });
    app.use(router.routes());
};
