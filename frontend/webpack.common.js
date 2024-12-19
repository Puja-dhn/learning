const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");

module.exports = {
  entry: path.join(__dirname, "src", "index.tsx"),
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: [".ts", ".js", ".tsx"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext][query]",
        },
      },
      {
        test: /\.pdf/,
        type: "asset/resource",
        generator: {
          filename: "assets/pdfs/[name][contenthash][ext][query]",
        },
      },
      {
        test: /\.(woff|woff2)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext][query]",
        },
      },
      { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      favicon: path.join(__dirname, "src/assets/images", "favicon.ico"),
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "index.css",
      chunkFilename: "index.[id].css",
    }),
    new CompressionPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "src/assets/locales", to: "assets/locales" },
        { from: "src/assets/js", to: "assets/js" },
        { from: "src/assets/css", to: "assets/css" },
      ],
    }),
    new HtmlWebpackTagsPlugin({
      tags: ["assets/js/default.js", "assets/css/default.css"],
      append: false,
    }),
  ],
};
