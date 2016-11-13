var path = require("path");
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  context: __dirname,

  entry: {
    builder: './../apps/builder/BuilderApp',
    response: './../apps/response/ResponseApp',
    vendors: ['react']
  },

  output: {
    filename: "[name]-[hash].js"
  },

  externals: [
  ],

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin("[name]-[hash].css"),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.[hash].js'),
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise',
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ],

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  }
};
