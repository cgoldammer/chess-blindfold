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
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      },

			// {
			// 	test: /\.css$/,
			// 	loader: 'css-loader',
			// 	include: [path.join(__dirname, 'src')],
			// 	options: {
          // modules: {
            // localIdentName: '[name]__[local]___[hash:base64:5]'
          // }
			// 	}
			// },

			{
				test: /\.css$/,
				use: [
          'style-loader',
          { 
            loader: 'css-loader',
            options: {modules: true}
          }]
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
