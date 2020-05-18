const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: 'game.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
    },
    devtool: 'none',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                // exlude: /node_modules/,
            },
            {
                test: /\.css$/,
                // exlude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName:
                                    '[name]__[local]__[hash:base64:5]',
                            },
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [autoprefixer()],
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                // exlude: /node_modules/,
                loader: 'url-loader?limit=10000&name=img/[name].[ext]',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + 'index.html',
            filename: 'index.html',
            inject: 'body',
        }),
    ],
};
