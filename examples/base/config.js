const path = require("path");

module.exports = {
  context: path.resolve(__dirname),
  bail: true,
  mode: "development",
  devtool: false,
  entry: {
    page1: "./src/page1",
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  experiments: {},
  plugins: [],
  stats: "summary",
};
