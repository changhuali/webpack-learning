const path = require("path");

module.exports = {
  context: path.resolve(__dirname),
  mode: "development",
  entry: {
    page1: "./src/page1",
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       presets: [["@babel/preset-env", { targets: "defaults" }]],
      //     },
      //   },
      // },
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  experiments: {
    outputModule: false,
  },
  optimization: {
    innerGraph: true,
  },
  plugins: [
    new (class PrintModuleOrderPlugin {
      apply(compiler) {
        compiler.hooks.compilation.tap(
          "PrintModuleOrderPlugin",
          (compilation) => {
            compilation.hooks.succeedModule.tap(
              "PrintModuleOrderPlugin",
              (module) => {
                console.log(module.rawRequest);
              }
            );
          }
        );
        compiler.hooks.finishMake.tap(
          "PrintModuleOrderPlugin",
          (compilation) => {
            console.log(compilation.moduleGraph);
          }
        );
      }
    })(),
  ],
};
