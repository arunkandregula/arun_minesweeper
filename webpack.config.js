module.exports = {
    entry: './src/js/main.js',
    output: {
        path: '/dist',
        publicPath: '/arun_minesweeper',
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
    }
}