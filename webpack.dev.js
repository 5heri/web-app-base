const Promise = require('es6-promise').Promise
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')

// For much faster building. Tradeoff: stylesheet sourcemaps will point to built files.
const useRawCssLoader = process.argv.indexOf('--raw-css') !== -1
const cssLoader = useRawCssLoader ? 'css-raw-loader' : 'css-loader?sourceMap'

const sassLoaders = [cssLoader, 'sass-loader?sourceMap']

module.exports = {
  context: path.join(__dirname, '.'),

  devtool: 'cheap-module-source-map',

  entry: {
    portalrenderer: './docs/src/client.js'
  },

  output: {
    path: path.join(__dirname, '/docs'),
    filename: 'client.js'
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.json', '.scss', '.css']
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components|\/frontend\/third-party)/,
        loaders: ['babel?cacheDirectory&presets[]=es2015&presets[]=react&presets[]=stage-0']
      },
      {
        test: /\.scss$|\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('css/[name].css'),
    new AssetsPlugin()
  ]
}
