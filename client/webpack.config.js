const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["./index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: { compact: false }
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: path.resolve(__dirname, "node_modules/webpack-dev-server/client"),
        loader: "null-loader"
      }
    ]
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/public", "index.html")
    })
  ]
};
