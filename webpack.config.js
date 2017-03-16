var path = require('path');

module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, '/public/build'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['latest', 'react']
            }
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
          path.resolve('./node_modules'),
          path.resolve('./src/components'),
        ]
    }
};