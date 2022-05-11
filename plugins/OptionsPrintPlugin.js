class OptionsPrintPlugin {
  apply(compiler) {
    compiler.hooks.initialize.tap('查看options', () => {
    })
  }
}

export default OptionsPrintPlugin