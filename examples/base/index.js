var webpack = require("../../../webpack/lib/index.js");
var config = require("./config.js");

const compiler = webpack(config);

compiler.run((err, stat) => {
  debugger
  // console.log(err);
});
