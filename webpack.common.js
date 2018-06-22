require.extensions['.css'] = () => {
  return;
};

var path = require('path');
var debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
			{
				test: /\.css$/,
				loader: 'style-loader',
				options: {
					hmr: true
				}
			},
			{
				test: /\.css$/,
				loader: 'css-loader',
				include: [path.join(__dirname, 'src')],
				query: { 
					modules: true,
					localIdentName: '[name]__[local]___[hash:base64:5]'
				}
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
				include: [path.join(__dirname, 'node_modules')]
			}
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
	devtool: debug ? "eval-source-map" : false,
  output: { path: __dirname, filename: debug ? 'lib/bundle.js' : 'lib/bundle.min.js' },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
};
