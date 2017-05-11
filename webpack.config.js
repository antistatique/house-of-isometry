/* globals require, module, __dirname */

const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'hidden-source-map',
  context: path.join(__dirname, './src'),
  entry: {
    app: './index.js'
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].bundle.js',
  },
  externals: {
    'jquery': 'jQuery',
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel?presets[]=es2015,plugins[]=transform-es2015-spread,plugins[]=transform-object-rest-spread']
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.html$/,
        loader: 'file',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: [
      path.resolve('./app'),
      'node_modules',
    ],
    alias: {
      L: 'leaflet',
      ClipperLib: 'clipper-lib',
      R: 'ramda',
    },
  },
  plugins: [

  ],
};