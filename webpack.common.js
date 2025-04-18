const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/index.js'),
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        fallback: {
            os: require.resolve('os-browserify/browser'),
            path: require.resolve('path-browserify'),
            crypto: require.resolve('crypto-browserify'),
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify'),
            vm: require.resolve('vm-browserify'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Weather App',
            template: '/src/index.html',
            filename: 'index.html',
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env),
        }),
    ],
};
