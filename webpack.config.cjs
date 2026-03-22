const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: './',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
            test: /\.(mp3|wav)$/i,
            type: 'asset/resource',
        },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './template.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets', to: 'assets' },
            ],
        }),
    ],
    devServer: {
        static: [
            { directory: path.resolve(__dirname, 'dist') },
            { directory: path.resolve(__dirname, 'assets'), publicPath: '/assets' },
        ],
        open: true,
    },
    mode: 'development',
};