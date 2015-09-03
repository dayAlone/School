import webpack from 'webpack';
import webpackMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import webpackConfig from '../../webpack.config';

const compiler = webpack(webpackConfig);

export default [
    webpackMiddleware(compiler, {
        noInfo: true,
        publicPath: '/js/'
    }),
    webpackHotMiddleware(compiler, {
        log: false,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
    })
];
