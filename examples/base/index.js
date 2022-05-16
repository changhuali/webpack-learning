var webpack = require("../../../webpack/lib/index.js");
var config = require("./config.js");

const compiler = webpack(config);

compiler.hooks.compilation.tap("Test", (compilation) => {
  compilation.hooks.log.tap("Test", (name, logEntry) => {
    console.log(name, logEntry.args[2] / 1000000000);
  });
});

compiler.run((err, stat) => {
  console.log(err);
});
