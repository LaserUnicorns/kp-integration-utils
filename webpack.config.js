const path = require('path')

module.exports = {
    target: 'electron-main',
    context: path.join(__dirname, 'src'),
    entry: {
        app: './',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
        ],
    },
}
