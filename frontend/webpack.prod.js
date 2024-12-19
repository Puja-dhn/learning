const { merge } = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common.js");
require("dotenv").config({ path: "./production.env" });

module.exports = merge(common, {
  mode: "production",
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  output: {
    filename: "[name].[contenthash].js",
    publicPath: process.env.REACT_APP_BASENAME,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
  optimization: {
    // minimize: false,
    splitChunks: {
      minSize: 10000,
      maxSize: 250000,
    },
  },
});
