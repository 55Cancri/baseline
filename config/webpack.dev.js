import webpack from 'webpack'
import merge from 'webpack-merge'

import commonConfig from './webpack.common'

module.exports = merge(commonConfig, {
  devtool: 'eval-source-map',

  entry: {
    'app': [
      'webpack-hot-middleware/client?reload=true'
    ]
  },

  output: {
    filename: 'js/[name].js',
    chunkFilename: '[id].chunk.js'
  },

  devServer: {
    contentBase: './client/public',
    historyApiFallback: true,
    stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
  }
})
