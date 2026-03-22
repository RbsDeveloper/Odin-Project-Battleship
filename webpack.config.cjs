const HtmlWebpackPlugin = require('html-webpack-plugin');
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
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './template.html',
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