var webpack = require('webpack');

module.exports = {
    context: __dirname + '/client/js',
    entry: [
      // Add the client which connects to our middleware
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      // And then the actual application
      './app.js'
    ],
    output: {
        path: __dirname + '/public/js/',
        publicPath: '/js/',
        filename: 'app.js'
    },
    devtool: '#source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
