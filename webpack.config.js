const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
      publicPath: isProduction ? "/Graphql/" : "/",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "index.html",
      }),
      ...(isProduction
        ? [
            new CopyPlugin({
              patterns: [{ from: "public/404.html", to: "404.html" }],
            }),
          ]
        : []),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      historyApiFallback: true,
      port: 3000,
      hot: true,
      open: true,
      compress: true,
    },
    devtool: isProduction ? "source-map" : "eval-source-map",
  };
};
