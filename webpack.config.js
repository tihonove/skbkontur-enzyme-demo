/* eslint-disable */
module.exports = {
    entry: {
        'index': ['babel-polyfill', './src/index.js'],
    },
    output: {
        path: 'dist',
        publicPath: '/dist/',
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
            },
            {
                test: /\.(c|le)ss$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader!less-loader',
            },
            {
                test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
            },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                include: /retail-ui/,
                exclude: /retail-ui(\\|\/)node_modules/,
            },
            {
                test: /\.(c|le)ss$/,
                include: /retail-ui/,
                exclude: /retail-ui(\\|\/)node_modules/,
                loader: 'style-loader!css-loader!less-loader',
            },
            {
                test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
                include: /retail-ui/,
                exclude: /retail-ui(\\|\/)node_modules/,
                loader: 'file-loader',
            },
        ],
    },
    resolve: {
        modulesDirectories: ['node_modules', 'local_modules', 'web_modules'],
        extensions: ['', '.js', '.adapter.jsx', '.jsx'],
    },
};
