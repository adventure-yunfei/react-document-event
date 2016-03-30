/*eslint-env node*/
var path = require('path');

const TEST_SRC_DIR = __dirname;

module.exports = {
    entry: {
        test: path.join(TEST_SRC_DIR, 'test.js')
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel'
        }]
    },
    output: {
        path: path.join(TEST_SRC_DIR, '..', 'dist'),
        filename: '[name].js'
    }
};
