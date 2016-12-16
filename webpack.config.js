const isProduction = process.env.NODE_ENV === 'production';

const config = {
    entry: './src/scripts/app.ts',
    output: {
        path: __dirname + '/build/scripts',
        filename: 'app.js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    plugins: []
};

if (isProduction) {
    const webpack = require('webpack');
    const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin();
    config.plugins.push(uglifyJsPlugin);
}
else {
    // Source maps support
    config.devtool = 'source-map';
}

module.exports = config;
