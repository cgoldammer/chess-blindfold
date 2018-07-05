const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

const features = {
  'SHOWUSERS': JSON.stringify(true)
, 'BACKENDURL': JSON.stringify('snap_dev')
}

devExports = {
  mode: 'development',
  devtool: "eval-source-map",
  output: { path: __dirname, filename: 'lib/bundle.js'},
  devServer: {
    contentBase: './lib',
    hot: true,
    port: 8082,
    host: '0.0.0.0',
    disableHostCheck: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  plugins: [
    new webpack.DefinePlugin(features)
  ]
}

module.exports = merge(common, devExports);
