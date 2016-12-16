module.exports = {
    entry: './src/scripts/app.ts',
    output: {
        path: __dirname + '/build/scripts',
        filename: 'app.js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },

    // Source maps support
    devtool: 'source-map',

    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};
