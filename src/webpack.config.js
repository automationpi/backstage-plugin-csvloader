const path = require('path');

module.exports = {
    // Your existing configuration options...

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js'],

        // Try to resolve these imports in the current directory
        preferRelative: true,

        // Polyfill or mock certain Node.js globals and modules
        fallback: {
            "events": require.resolve("events/"),
            "stream": require.resolve("stream-browserify/"),
            "util": require.resolve("util/"),
            "buffer": require.resolve("buffer/"),
            "crypto": require.resolve("crypto-browserify"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "path": require.resolve("path-browserify"),
            "querystring": require.resolve("querystring-es3"),
            "url": require.resolve("url/"),
            "vm": require.resolve("vm-browserify"),
            "zlib": require.resolve("browserify-zlib"),
        },
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },

    // Exclude 'ts-node' from the bundle
    externals: {
        'ts-node': 'commonjs ts-node',
    },
};