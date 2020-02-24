const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: path.join(__dirname, './src/'),
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/',
    historyApiFallback: true,
    compress: true,
    port: 8082,
    hot: true,
    https: true
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
      filename: path.join(__dirname, 'dist', 'index.html'),
      inject: true
    })
  ]
};
