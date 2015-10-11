require('dotenv').config({silent: true});
require('babel/register');
var webpack = require('webpack');
var config = require('config');
var env = process.env.NODE_ENV || 'test';
var CompressionPlugin = require('compression-webpack-plugin');

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

if (env !== 'production') {
    webpackConfig.plugins = webpackConfig.plugins.concat([
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()]);
    for (const el in webpackConfig.entry) {
        webpackConfig.entry[el].push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000');
    }
    //webpackConfig.devtool = '#source-map';
} else {
    webpackConfig.plugins = webpackConfig.plugins.concat([
        new CompressionPlugin({
            asset: '{file}.gz',
            algorithm: 'gzip',
            regExp: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]);
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
}

module.exports = webpackConfig;
