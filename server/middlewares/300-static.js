import serve from 'koa-static-server';
export default serve({rootDir: __dirname + '../../../client/public/', rootPath: '/layout'});
