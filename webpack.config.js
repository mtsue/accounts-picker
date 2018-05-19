const path = require('path')

module.exports = {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path: path.join(__dirname, 'extension/build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: [['env', {
                    target: {
                        browsers: ['last 2 Chrome verisons'],
                    }
                }]],
                plugins: ['transform-regenerator']
            }
        }]
    }
}