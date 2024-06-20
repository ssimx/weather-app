const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

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
    plugins: [
        new HtmlWebpackPlugin(
            {
                title: 'Weather App',
                template: '/src/index.html',
                filename: 'index.html',
                searchApi: `${process.env.WEATHER_APP_SEARCH_AUTOCOMPLETE_KEY}`,
            },
        ),
    ],
};
