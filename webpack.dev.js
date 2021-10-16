const merge = require('webpack-merge').merge;
const webpack = require('webpack');
const common = require('./webpack.common.js');

const features = {
  'SHOWUSERS': JSON.stringify(true)
, 'BACKENDURL': JSON.stringify('snap_dev')
}

devExports = {
  mode: 'development',
  devtool: "eval-source-map",
  devServer: {
    static: './serve_content',
    port: 8082,
    host: '0.0.0.0',
    historyApiFallback: { index: 'index_dev.html' },
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
