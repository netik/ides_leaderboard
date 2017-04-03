// webpack.config.js
const config = {
  context: __dirname + '/src',
  entry: './app.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
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
  }
}

module.exports = config
