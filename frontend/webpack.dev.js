const { merge } = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common.js");
require("dotenv").config({ path: "./development.env" });

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    publicPath: "/",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
  devServer: {
    static: "./dist",
    historyApiFallback: true,
    compress: true,
  },
});
