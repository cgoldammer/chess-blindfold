const merge = require('webpack-merge').merge;
const common = require('./webpack.common.js');
const webpack = require('webpack');

prodExports = {
  mode: 'production',
  output: { path: __dirname, filename: 'serve_content/prod/bundle.min.js' },
  devtool: false,
}

module.exports = merge(common, prodExports);
