const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: { compact: false }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      // template: "./index.html"
      template: path.resolve(__dirname, "./src/public", "index.html"),
      filename: './index.html'
    })
  ]
};
