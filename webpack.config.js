var webpack = require("webpack");

// webpack.config.js
const config = {
  context: __dirname + '/src',
  entry: {
    front: './front-app.js',
    leaderboard: './leaderboard-app.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: "[name]-bundle.js"
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: __dirname + '/src',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['react'],
              ['es2015', { modules: false }]
            ]
          }
        }
      ]
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]
}

module.exports = config
