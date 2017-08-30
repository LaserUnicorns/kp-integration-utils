const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = function (env = {}) {
    return {
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
        devtool: 'source-map',
        plugins: [
            new CopyWebpackPlugin([
                { from: '../node_modules/jquery/dist', to: 'external/jquery/' },
                { from: '../node_modules/popper.js/dist/umd', to: 'external/popper.js/' },
                { from: '../node_modules/bootstrap/dist', to: 'external/bootstrap/' },
            ]),
            new webpack.DefinePlugin({
                __PROD__: !!env.prod,
            }),
        ],
    }
}
