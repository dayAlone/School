require('babel/register');
var webpack = require('webpack');
var config = require('config');
var fs = require('fs');
var env = process.env.NODE_ENV || 'test';

var webpackConfig = {
    entry: {
        app: [config.__dirname + '/client/js/index.js']
    },
    output: {
        path: __dirname + '/client/public/js/',
        publicPath: '/layout/js/',
        filename: '[name].js',
        pathinfo: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel-loader']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ]
};

if (env !== 'productions') {
    webpackConfig.plugins = webpackConfig.plugins.concat([
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()]);
    for (const el in webpackConfig.entry) {
        webpackConfig.entry[el].push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000');
    }
    //webpackConfig.devtool = '#source-map';
} else {
    //
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
            warnings: false
        }
    }));
}

module.exports = webpackConfig;
