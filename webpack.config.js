var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    context: __dirname,
    entry: './src/js/main.js',
    output: {
        path: '/dist',
        publicPath: '/public',
        filename: 'bundle.js'
    },
    devServer: {
        inline: true,
        port: 3333
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node-modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.sass$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.jpg$/,
                loaders: ['file-loader']
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
        {
            from: '/src/assets/**/*',
            to: '/assets'
        }])
    ]
}