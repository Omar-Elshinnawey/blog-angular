const webpack = require('webpack'),
    path = require('path');

var config = {

    context: path.join(__dirname, 'src'),

    entry: {
        bundle: './main.ts',
        vendor: './vendor.ts',
        polyfills: './polyfills.ts'
    },

    output: {
        path: path.join(__dirname, 'public', 'lib'),
        filename: '[name].js',
        publicPath: '/assets/'
    },

    devServer: {
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true,
        port: 8080
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    module: {
        loaders: [{
            test: /\.ts?$/,
            loaders: ['awesome-typescript-loader', 'angular-router-loader'],
        }]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['bundle', 'vendor', 'polyfills']
        }),
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname, './public/ts'), {}
        ),
        /* new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin() */

    ]
};

module.exports = config;
