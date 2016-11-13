var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var config = require('./webpack.base.config.js');


config.devtool = "#eval-source-map";

config.output.path = path.resolve('./static/bundles/local/');

config.plugins = config.plugins.concat([
  new webpack.NoErrorsPlugin(),
  new BundleTracker({filename: './config/webpack-stats-local.json', includePath: false}),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('development')
  }})
]);

config.module.loaders.push(
  { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel'] }
);

config.entry = {
  builder: [
    'webpack-dev-server/client?http://localhost:3000',
    './../apps/builder/BuilderApp'
  ],
  response: [
    'webpack-dev-server/client?http://localhost:3000',
    './../apps/response/ResponseApp'
  ],
};

config.output.publicPath = 'http://localhost:3000/assets/bundles/';


module.exports = config;
