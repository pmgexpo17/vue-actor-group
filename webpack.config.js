var webpack = require('webpack')
var fileName = require('./package').name

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './index.js',
  output: {
    filename: fileName + '.js',
    library: 'vue-actor-group',
    libraryTarget: 'umd'
  },
  externals: {
    'string-pixel-width': 'string-pixel-width'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  }
}
