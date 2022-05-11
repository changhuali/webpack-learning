var webpack = require("../../../webpack/lib/index.js");
var config = require("./config.js");

const compiler = webpack(config);

compiler.hooks.compilation.tap('Test', compilation => {
  compilation.hooks.addEntry.tap('Test', (entry, options) => {
    console.log(entry.request, '===========add entry')
  })
})
compiler.hooks.entryOption.tap('Test', () => {
  console.log('=========entryOption')
})

compiler.run((err, stat) => {
  console.log(err);
});
