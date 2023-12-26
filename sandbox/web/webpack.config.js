const path = require('path');

module.exports = {
  entry: {
    "axolot-test" : './src/index.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader"
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/js'),
  },
  experiments: {
    syncWebAssembly: true,
    asyncWebAssembly: true
  }
};