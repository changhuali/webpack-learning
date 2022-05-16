const path = require("path");

module.exports = {
  context: path.resolve(__dirname),
  mode: "production",
  entry: {
    page1: "./src/page1",
  },

  plugins: [],
};
