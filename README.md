# source reading record

**构建脚本**
```js
const webpack = require('webpack');

const compiler = webpack({
  // 配置对象、后面介绍
}, (err, stats) => { // [Stats Object]（后面介绍）
  if (err || stats.hasErrors()) {
    // 在这里处理错误
  }
  // 处理完成
});
```
这里以api的方式调用`webpack`，此时会返回一个`Compiler`实例，`Compiler`是`webpack`的主要引擎，它会通过*配置对象*创建`compilation`实例（后序遇到再介绍）。`compiler`也暴露了很多生命周期钩子，具体的钩子在分析`Compiler`类时会介绍。	

**webpack impl**
```js
const webpack = (options, callback) => {
  const create = () => {
    // 校验webpack配置项
    if (!webpackOptionsSchemaCheck(options)) {
      getValidateSchema()(webpackOptionsSchema, options)
    }
    let compiler
    let watch = false
    let watchOptions
    // 处理webpack配置为一个数组类型的情况
    if (Array.isArray(options)) {
      compiler = createMultiCompiler(options)
      watch = options.some(options => options.watch)
      watchOptions = options.map(options => options.watchOptions || {})
    } else {
      const webpackOptions = options
      // 创建一个compiler
      compiler = createCompiler(webpackOptions)
      watch = webpackOptions.watch
      watchOptions = webpackOptions.watchOptions || {}
    }
    return { compiler, watch, watchOptions }
  }
  if (callback) {
    try {
      // 创建compiler
      const { compiler, watch, watchOptions } = create()
      // 如果watch为true，执行compiler.watch
      if (watch) {
        compiler.watch(watchOptions, callback)
      } else {
        // 否则执行compiler.run，并监听compiler.close事件
        compiler.run((err, stats) => {
          compiler.close(err2 => {
            callback(err || err2, stats)
          })
        })
      }
      // 返回compiler
      return compiler
    } catch (err) {
      // 如果代码抛错，执行callback
      process.nextTick(() => callback(err))
      return null
    }
  } else {
    // 创建compiler
    const { compiler, watch } = create()
    // 如果watch为true，提示需要传递callback参数
    if (watch) {
      util.deprecate(
        () => {},
        "A 'callback' argument needs to be provided to the 'webpack(options, callback)' function when the 'watch' option is set. There is no way to handle the 'watch' option without a callback.",
        'DEP_WEBPACK_WATCH_WITHOUT_CALLBACK',
      )()
    }
    // 直接返回compiler，并不会执行后序打包流程
    return compiler
  }
}
```
webpack函数内部会根据参数`callback`以及配置项`watch`的值执行不同逻辑，但是最终都会创建并返回一个`Compiler`实例。
构建脚本中传递了`callback`参数，`webpack`函数内部会执行compiler的run方法（假设配置项`watch`为`false`）。我们还是先看看创建Compiler实例时做了些啥。

**createCompiler impl**
```js
const createCompiler = rawOptions => {
	// webpack的很多配置项都支持多中配置方式，这里是为了将这些配置项统一化以及给一些配置项设置默认值
	const options = getNormalizedWebpackOptions(rawOptions);
	// 设置options.context和infrastructureLogging默认值
	applyWebpackOptionsBaseDefaults(options);
	// 实例化Compiler
	const compiler = new Compiler(options.context);
	compiler.options = options;
	// 对compiler的infrastructureLogger、inputFileSystem、outputFileSystem、intermediateFileSystem、watchFileSystem进行了设置，并对声明周期钩子beforeRun进行了监听
	new NodeEnvironmentPlugin({
		infrastructureLogging: options.infrastructureLogging
	}).apply(compiler);
	// 初始化配置项中的所有插件
	if (Array.isArray(options.plugins)) {
		for (const plugin of options.plugins) {
			if (typeof plugin === "function") {
				plugin.call(compiler, compiler);
			} else {
				plugin.apply(compiler);
			}
		}
	}
	// 设置部分配置项的默认值
	applyWebpackOptionsDefaults(options);
	// 执行钩子environment
	compiler.hooks.environment.call();
	// 执行钩子afterEnvironment
	compiler.hooks.afterEnvironment.call();
	// 设置compiler的*outputPath和name、初始化一些内部插件、执行一些生命周期钩子
	new WebpackOptionsApply().process(options, compiler);
	// 执行钩子initialize
	compiler.hooks.initialize.call();
	// 最后返回Compiler实例
	return compiler;
};
```
createCompiler主要工作
- 对配置进行了normalize ===> `getNormalizedWebpackOptions(rawOptions)`
- 设置`context`、日志选项 ===> `applyWebpackOptionsBaseDefaults(options)`
- 实例化Compiler ===> `new Compiler(options.context)`
- 设置compiler的infrastructureLogger和文件系统 ===> `new NodeEnvironmentPlugin({ infrastructureLogging: options.infrastructureLogging }).apply(compiler)`
- 初始化配置项中的所有插件
- 设置部分配置项的默认值 ===> `applyWebpackOptionsDefaults(options)`
- 设置compiler部分属性、初始化内部插件 ===> `new WebpackOptionsApply().process(options, compiler)`
- 触发部分生命周期钩子
  	- environment
	- afterEnvironment
	- entryOption
	- afterPlugins
	- afterResolvers
	- initialize