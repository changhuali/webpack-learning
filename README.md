# source reading record

## 引擎加载阶段

**构建脚本**
```js
const webpack = require('webpack');

const compiler = webpack({
  // 配置对象、稍后介绍
}, (err, stats) => { // [Stats Object]暂时不分析
  if (err || stats.hasErrors()) {
    // 在这里处理错误
  }
  // 处理完成
});
```
调用`webpack`会返回一个`Compiler`实例，`Compiler`是`webpack`的主要引擎。

**webpack**
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
webpack函数内部会根据参数`callback`以及配置项`watch`的值执行不同逻辑，但是最终都会通过`createCompiler`或`createMultiCompiler`创建并返回一个`Compiler`实例。

**createCompiler**
```js
const createCompiler = rawOptions => {
  // webpack的很多配置项都支持多种配置方式，这里是为了将这些配置项统一化以及给一些配置项设置默认值
  const options = getNormalizedWebpackOptions(rawOptions)
  // 设置options.context和infrastructureLogging默认值
  applyWebpackOptionsBaseDefaults(options)
  // 实例化Compiler
  const compiler = new Compiler(options.context)
  compiler.options = options
  // 对compiler的infrastructureLogger、inputFileSystem、outputFileSystem、intermediateFileSystem、watchFileSystem进行了设置，并对声明周期钩子beforeRun进行了监听
  new NodeEnvironmentPlugin({
    infrastructureLogging: options.infrastructureLogging,
  }).apply(compiler)
  // 初始化配置项中的所有插件
  if (Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      if (typeof plugin === 'function') {
        plugin.call(compiler, compiler)
      } else {
        plugin.apply(compiler)
      }
    }
  }
  // 设置部分配置项的默认值
  applyWebpackOptionsDefaults(options)
  // 执行钩子environment
  compiler.hooks.environment.call()
  // 执行钩子afterEnvironment
  compiler.hooks.afterEnvironment.call()
  // 设置compiler的*outputPath和name、初始化一些内部插件、执行一些生命周期钩子
  new WebpackOptionsApply().process(options, compiler)
  // 执行钩子initialize
  compiler.hooks.initialize.call()
  // 最后返回Compiler实例
  return compiler
}
```
createCompiler主要工作
- 对配置进行了normalize ===> `getNormalizedWebpackOptions(rawOptions)`
- 设置`context`、日志选项 ===> `applyWebpackOptionsBaseDefaults(options)`
- 实例化Compiler ===> `new Compiler(options.context)`   

  >Compiler构造器主要是挂载一些钩子到实例，并提供部分属性和方法供插件使用，暂时不分析。
- 设置`compiler`的`infrastructureLogger`和文件系统 ===> `new NodeEnvironmentPlugin({ infrastructureLogging: options.infrastructureLogging }).apply(compiler)`
- 初始化配置项中的所有插件
- 设置部分配置项的默认值 ===> `applyWebpackOptionsDefaults(options)`
- 设置`compiler`部分属性、初始化内部插件 ===> `new WebpackOptionsApply().process(options, compiler)`

在Compiler构造器中会初始化下列钩子

- initialize(SyncHook)

- shouldEmit(SyncBailHook)
- done(AsyncSeriesHook)
- afterDone(SyncHook)
- additionalPass(AsyncSeriesHook)
- beforeRun(AsyncSeriesHook)
- run(AsyncSeriesHook)
- emit(AsyncSeriesHook)
- assetEmitted(AsyncSeriesHook)
- afterEmit(AsyncSeriesHook)

- thisCompilation(SyncHook)
- compilation(SyncHook)
- normalModuleFactory(SyncHook)
- contextModuleFactory(SyncHook)

- beforeCompile(AsyncSeriesHook)
- compile(SyncHook)
- make(AsyncParallelHook)
- finishMake(AsyncSeriesHook)
- afterCompile(AsyncSeriesHook)

- watchRun(AsyncSeriesHook)
- failed(SyncHook)
- invalid(SyncHook)
- watchClose(SyncHook)
- shutdown(AsyncSeriesHook)

- infrastructureLog(SyncBailHook)

- environment(AsyncSeriesHook)
- afterEnvironment(AsyncSeriesHook)
- afterPlugins(AsyncSeriesHook)
- afterResolvers(AsyncSeriesHook)
- entryOption(AsyncSeriesHook)

`createCompiler`执行过程中会触发下列钩子
- environment
- afterEnvironment
- entryOption
- afterPlugins
- afterResolvers
- initialize

插件初始化顺序
- NodeEnvironmentPlugin

- 用户配置的所有插件

- ExternalsPlugin
- NodeTargetPlugin
- ElectronTargetPlugin

- ChunkPrefetchPreloadPlugin

- ArrayPushCallbackChunkFormatPlugin 
- CommonJsChunkFormatPlugin
- ModuleChunkFormatPlugin

- EnableChunkLoadingPlugin
- EnableWasmLoadingPlugin
- EnableLibraryPlugin

- ModuleInfoHeaderPlugin

- CleanPlugin

- EvalSourceMapDevToolPlugin 
- SourceMapDevToolPlugin
- EvalDevToolModulePlugin

- JavascriptModulesPlugin
- JsonModulesPlugin
- AssetModulesPlugin

- WebAssemblyModulesPlugin
- AsyncWebAssemblyModulesPlugin

- LazyCompilationPlugin

- HttpUriPlugin

- EntryOptionPlugin

- RuntimePlugin

- InferAsyncModulesPlugin

- DataUriPlugin
- FileUriPlugin

- CompatibilityPlugin
- HarmonyModulesPlugin
- AMDPlugin
- RequireJsStuffPlugin
- CommonJsPlugin
- LoaderPlugin
- NodeStuffPlugin
- APIPlugin
- ExportsInfoApiPlugin
- WebpackIsIncludedPlugin
- ConstPlugin
- UseStrictPlugin
- RequireIncludePlugin
- RequireEnsurePlugin
- RequireContextPlugin
- ImportPlugin
- SystemPlugin
- ImportMetaPlugin
- URLPlugin
- WorkerPlugin

- DefaultStatsFactoryPlugin
- DefaultStatsPresetPlugin
- DefaultStatsPrinterPlugin

- JavascriptMetaInfoPlugin

- WarnNoModeSetPlugin

- EnsureChunkConditionsPlugin
- RemoveParentModulesPlugin
- RemoveEmptyChunksPlugin
- MergeDuplicateChunksPlugin
- FlagIncludedChunksPlugin
- SideEffectsFlagPlugin
- FlagDependencyExportsPlugin
- FlagDependencyUsagePlugin
- InnerGraphPlugin
- MangleExportsPlugin
- ModuleConcatenationPlugin
- SplitChunksPlugin
- RuntimeChunkPlugin
- NoEmitOnErrorsPlugin
- RealContentHashPlugin
- WasmFinalizeExportsPlugin
- NaturalModuleIdsPlugin
- NamedModuleIdsPlugin
- WarnDeprecatedOptionPlugin
- HashedModuleIdsPlugin
- DeterministicModuleIdsPlugin
- OccurrenceModuleIdsPlugin
- NaturalChunkIdsPlugin
- NamedChunkIdsPlugin
- DeterministicChunkIdsPlugin
- OccurrenceChunkIdsPlugin
- DefinePlugin
- TerserPlugin

- SizeLimitsPlugin

- TemplatedPathPlugin

- RecordIdsPlugin

- WarnCaseSensitiveModulesPlugin

- AddManagedPathsPlugin

- AddBuildDependenciesPlugin
- MemoryWithGcCachePlugin
- MemoryCachePlugin

- IdleFileCachePlugin
- PackFileCacheStrategy
- ResolverCachePlugin

- IgnoreWarningsPlugin

在得到`compiler`后，我们会执行`compiler.run`或`compiler.watch`来启动编译过程，我们先分析`run`方法。

**compiler.run**
```js
run(callback) {
  if (this.running) {
    return callback(new ConcurrentCompilationError());
  }

  let logger;

  const finalCallback = (err, stats) => {
    if (logger) logger.time("beginIdle");
    this.idle = true;
    this.cache.beginIdle();
    this.idle = true;
    if (logger) logger.timeEnd("beginIdle");
    this.running = false;
    if (err) {
      this.hooks.failed.call(err);
    }
    if (callback !== undefined) callback(err, stats);
    this.hooks.afterDone.call(stats);
  };

  const startTime = Date.now();

  this.running = true;

  // compiler.compile执行完成后的回调
  const onCompiled = (err, compilation) => {
    if (err) return finalCallback(err);
    /** 代码省略，稍后介绍 */
  };

  const run = () => {
    this.hooks.beforeRun.callAsync(this, err => {
      if (err) return finalCallback(err);

      this.hooks.run.callAsync(this, err => {
        if (err) return finalCallback(err);
        // readRecords暂时不分析，执行成功后会执行compiler.compile
        this.readRecords(err => {
          if (err) return finalCallback(err);

          this.compile(onCompiled);
        });
      });
    });
  };
  if (this.idle) { // 暂时不分析
    this.cache.endIdle(err => {
      if (err) return finalCallback(err);

      this.idle = false;
      run();
    });
  } else {
    run();
  }
}
```

`compiler.run`主要通过执行内部的`run`函数来启动编译过程，`run`函数主要是负责触发一些钩子。

compiler.hooks触发顺序  
- beforeRun
- run

`run`钩子执行成功后执行`compiler.compile`

**compiler.compile**
```js
compile(callback) {
  // 创建NormalModuleFactory、ContextModuleFactory
  const params = this.newCompilationParams()
  this.hooks.beforeCompile.callAsync(params, err => {
    if (err) return callback(err)

    this.hooks.compile.call(params)
    // 创建Compilation实例，Compilation类实现代码有4000+行，稍后分析
    const compilation = this.newCompilation(params)

    const logger = compilation.getLogger('webpack.Compiler')

    logger.time('make hook')
    this.hooks.make.callAsync(compilation, err => {
      logger.timeEnd('make hook')
      if (err) return callback(err)

      logger.time('finish make hook')
      this.hooks.finishMake.callAsync(compilation, err => {
        logger.timeEnd('finish make hook')
        if (err) return callback(err)

        process.nextTick(() => {
          logger.time('finish compilation')
          compilation.finish(err => {
            logger.timeEnd('finish compilation')
            if (err) return callback(err)

            logger.time('seal compilation')
            compilation.seal(err => {
              logger.timeEnd('seal compilation')
              if (err) return callback(err)

              logger.time('afterCompile hook')
              this.hooks.afterCompile.callAsync(compilation, err => {
                logger.timeEnd('afterCompile hook')
                if (err) return callback(err)
                // 之前之前的compiler.run onCompiled回调函数
                return callback(null, compilation)
              })
            })
          })
        })
      })
    })
  })
}
```
`compiler.compile`主要是触发一些钩子，然后在执行过程中创建了`Compilation`实例并通过该实例执行一次编译过程，最后在`afterCompile`钩子调用成功后会执行`compiler.run onCompiled`函数。

compiler.hooks触发顺序  
- normalModuleFactory
- contextModuleFactory
- beforeCompile
- compile
- thisCompilation
- compilation
- make
- finishMake
- afterCompile

`Compilation`构造器中会初始化下列钩子以及大量的属性和方法（遇到再分析）

- buildModule(SyncHook)
- rebuildModule(SyncHook)
- failedModule(SyncHook)
- succeedModule(SyncHook)
- stillValidModule(SyncHook)

- addEntry(SyncHook)
- failedEntry(SyncHook)
- succeedEntry(SyncHook)

- dependencyReferencedExports(SyncWaterfallHook)

- executeModule(SyncHook)
- prepareModuleExecution(AsyncParallelHook)

- finishModules(AsyncSeriesHook)
- finishRebuildingModule(AsyncSeriesHook)
- unseal(SyncHook)
- seal(SyncHook)

- beforeChunks(SyncHook)
- afterChunks(SyncHook)

- optimizeDependencies(SyncBailHook)
- afterOptimizeDependencies(SyncHook)

- optimize(SyncHook)
- optimizeModules(SyncBailHook)
- afterOptimizeModules(SyncHook)

- optimizeChunks(SyncBailHook)
- afterOptimizeChunks(SyncHook)

- optimizeTree(AsyncSeriesHook)
- afterOptimizeTree(SyncHook)

- optimizeChunkModules(AsyncSeriesBailHook)
- afterOptimizeChunkModules(SyncHook)
- shouldRecord(SyncBailHook)

- additionalChunkRuntimeRequirements(SyncHook)
- runtimeRequirementInChunk(HookMap)
- additionalModuleRuntimeRequirements(SyncHook)
- runtimeRequirementInModule(HookMap)
- additionalTreeRuntimeRequirements(SyncHook)
- runtimeRequirementInTree(HookMap)

- runtimeModule(SyncHook)

- reviveModules(SyncHook)
- beforeModuleIds(SyncHook)
- moduleIds(SyncHook)
- optimizeModuleIds(SyncHook)
- afterOptimizeModuleIds(SyncHook)

- reviveChunks(SyncHook)
- beforeChunkIds(SyncHook)
- chunkIds(SyncHook)
- optimizeChunkIds(SyncHook)
- afterOptimizeChunkIds(SyncHook)

- recordModules(SyncHook)
- recordChunks(SyncHook)

- optimizeCodeGeneration(SyncHook)

- beforeModuleHash(SyncHook)
- afterModuleHash(SyncHook)

- beforeCodeGeneration(SyncHook)
- afterCodeGeneration(SyncHook)

- beforeRuntimeRequirements(SyncHook)
- afterRuntimeRequirements(SyncHook)

- beforeHash(SyncHook)
- contentHash(SyncHook)
- afterHash(SyncHook)
- recordHash(SyncHook)
- record(SyncHook)

- beforeModuleAssets(SyncHook)
- shouldGenerateChunkAssets(SyncBailHook)
- beforeChunkAssets(SyncHook)

- processAssets(AsyncSeriesHook)
- afterProcessAssets(SyncHook)
- processAdditionalAssets(AsyncSeriesHook)

- needAdditionalSeal(SyncBailHook)
- afterSeal(AsyncSeriesHook)

- renderManifest(SyncWaterfallHook)

- fullHash(SyncHook)
- chunkHash(SyncHook)

- moduleAsset(SyncHook)
- chunkAsset(SyncHook)

- assetPath(SyncWaterfallHook)

- needAdditionalPass(SyncBailHook)

- log(SyncBailHook)

- processWarnings(SyncWaterfallHook)
- processErrors(SyncWaterfallHook)

- statsPreset(HookMap)
- statsNormalize(SyncHook)
- statsFactory(SyncHook)
- statsPrinter(SyncHook)


**compiler.run onCompiled**
```js
const onCompiled = (err, compilation) => {
  if (err) return finalCallback(err)
  // 判断是否需要emitAssets，如果不需要，则直接触发done钩子并在钩子执行成功后执行用户传递的callback回调
  if (this.hooks.shouldEmit.call(compilation) === false) {
    compilation.startTime = startTime
    compilation.endTime = Date.now()
    const stats = new Stats(compilation)
    this.hooks.done.callAsync(stats, err => {
      if (err) return finalCallback(err)
      return finalCallback(null, stats)
    })
    return
  }
  process.nextTick(() => {
    logger = compilation.getLogger('webpack.Compiler')
    logger.time('emitAssets')
    // 生成资源文件，稍后介绍
    this.emitAssets(compilation, err => {
      logger.timeEnd('emitAssets')
      if (err) return finalCallback(err)

      if (compilation.hooks.needAdditionalPass.call()) {
        compilation.needAdditionalPass = true

        compilation.startTime = startTime
        compilation.endTime = Date.now()
        logger.time('done hook')
        const stats = new Stats(compilation)
        this.hooks.done.callAsync(stats, err => {
          logger.timeEnd('done hook')
          if (err) return finalCallback(err)
          // 暂时不分析
          this.hooks.additionalPass.callAsync(err => {
            if (err) return finalCallback(err)
            this.compile(onCompiled)
          })
        })
        return
      }
      // 生成records records暂时不分析
      logger.time('emitRecords')
      this.emitRecords(err => {
        logger.timeEnd('emitRecords')
        if (err) return finalCallback(err)

        compilation.startTime = startTime
        compilation.endTime = Date.now()
        logger.time('done hook')
        const stats = new Stats(compilation)
        this.hooks.done.callAsync(stats, err => {
          logger.timeEnd('done hook')
          if (err) return finalCallback(err)
          this.cache.storeBuildDependencies(
            compilation.buildDependencies,
            err => {
              if (err) return finalCallback(err)
              return finalCallback(null, stats)
            },
          )
        })
      })
    })
  })
}
```
`compiler.run onCompiled`主要是触发了一些钩子，然后在执行过程中执行`compiler.emitAssets`输出产物。

compiler.hooks触发顺序  
- shouldEmit
- emit
- assetEmitted
- afterEmit
- done
- additionalPass
- afterDone
- failed

**小结**

在执行`webpack`时，其内部会创建一个`compiler`，然后通过执行`compiler.run`方法启动编译过程，`compiler.run`会在`run`钩子执行成功后调用`compiler.compile`方法创建`compilation`，所有的编译工作都是基于`compilation`完成的，最后再执行`compiler.run onCompiled`输出资源。代码中我们看到`webpack`通过生命周期钩子（110个左右）管控构建流程，而所有的功能都是基于插件实现的。

## 编译阶段

前面的工作都是在为编译做准备，真正的编译工作是从`compiler.hooks.make.callAsync`执行后开始的，因此我们可以找出编译入口为`compilation.addEntry`方法。

**compilation.addEntry**

参数包含了入口名、`entryDependency`、入口options，然后调用`compilation._addEntryItem`方法。

**compilation._addEntryItem**

- 执行`this.entries.set(name, entryData)`
 
  将参数组装为一个`entryData`然后存储到以入口名为`key`的`compilation.entries`中，并且将之后同名的`entryDependency`都存储到该`entryData`中。

- 触发`compilation.hooks.addEntry`钩子

  内部没有相关插件注册这个钩子。

- 执行`compilation.addModuleTree`方法

  失败会触发`compilation.hooks.failedEntry`钩子，成功则触发`compilation.hooks.succeedEntry`钩子，然后完成`make`阶段。

**compilation.addModuleTree**

- 校验`dependency`是否合法
- 根据`dependency`的类型查找`compilation.dependencyFactories`中是否有对应的`moduleFactory`用于处理该依赖
- 执行`compilation.handleModuleCreation`方法

  如果结果包含错误信息，且`options.bail`为`true`，则会终止剩下流程，否则构建过程会继续。

**compilation.handleModuleCreation**

- 若`options.profile`为true，则会生成一个`ModuleProfile`实例
- 执行`compilation.factorizeModule`方法
  
**compilation.factorizeModule**

- 使用原参数调用`compilation.factorizeQueue.add`方法

  `compilation.factorizeQueue`是一个`AsyncQueue`实例，接下来需要先分析下`AsyncQueue`的作用。

**AsyncQueue**

- 将所有的`entry`依次存储到一个待处理队列，然后对这个待处理队列中的`entry`依次调用`processor`处理（异步）
- 限制`entry`并发处理的数量不能超过`options.parallelism`配置项（默认100）
- 可以停止处理待处理的`entry`，同时后序添加`entry`全部会以错误的方式返回结果

`compilation.factorizeQueue`的`processor`是`compilation._factorizeModule`方法。

**compilation._factorizeModule**

- 执行`factory.create`

  这里的`factory`是一个`NormalModuleFactory`实例。

**normalModuleFactory.create**

- 生成一个`resolveData`作为后序钩子的触发参数，其中包括了`entry`的一些`resolve`相关的信息
- 触发了`normalModuleFactory.hooks.beforeResolve`钩子
  
  该钩子类型为`AsyncSeriesBailHook`，如果注册该钩子，并返回`false`或者一个`object`类型的值，则不会处理该`entry`。

- 触发了`normalModuleFactory.hooks.factorize`钩子

  该钩子类型为`AsyncSeriesBailHook`，注册该钩子完成`entry`处理逻辑，`NormalModuleFactory`类在实例化的时候便注册了这个钩子，注册逻辑为

  - 触发`normalModuleFactory.hooks.resolve`钩子

    `NormalModuleFactory`类在实例化的时候便注册了这个钩子，功能和`beforeResolve`钩子差不多。

  - 触发`normalModuleFactory.hooks.afterResolve`钩子
  - 触发`normalModuleFactory.hooks.createModule`钩子
  - 触发`normalModuleFactory.hooks.module`钩子

**缓存**
命中缓存的模块不会执行build，而且会触发stillValidModule钩子


`watch`模式，新的编译过程启动前会保存一个时间戳到`lastWatcherStartTime`, `watchPack`在监听文件变化时会与该时间戳进行对比, 因此在`run` `beforeRun`等钩子中如果对监听的文件进行了修改, 则会触发新的编译流程。