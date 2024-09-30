module.exports = {
  // 其他 Webpack 設置
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/ // 忽略 node_modules
      }
    ]
  }
};
