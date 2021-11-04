# NodeEnvironmentPlugin

**使用方式**  

- `webpack`内部在生成`compiler`后会默认加载该插件
- `new webpack.node.NodeEnvironmentPlugin(options)`

**功能分析**

1. 初始化了`compiler`的`infrastructureLogger`属性

    自定义的一套日志打印系统，基于`process.stderr.write`实现，支持debug模式、控制日志打印级别、日志颜色开关。

2. 初始化了`compiler`的文件系统

    `compiler`与文件系统打交道的主要是下面4个属性，这四个属性均是基于`graceful-fs`包实现的。

    - inputFileSystem

      一个`CachedInputFileSystem`实例，该类内部通过拦截`lstat`、`stat`、`readdir`、`readFile`、`readJson`等方法实现了一套缓存机制。

      缓存实现：同类方法（同个方法的同步xxx和异步实现xxxSync）挂载到同一个`CacheBackend`实例上，该实例内部维护了一个`Map`实例，以`path`为`key`，文件内容为`value`，并且该类实现了`purge`方法，可以通过该方法清理缓存。

      缓存清除策略：CacheBackend实例内部保存了一个私有的`_levels`属性，其类型为`Set<Path>[]`(长度为`120`)，用来存储所有的`path`，以`500ms`为一个`tick`，用私有属性`_currentLevel`保存当前的`tick`序号，同一个`tick`期间所有未命中缓存的请求都将存储到`this._levels[this._currentLevel]`，并将下一个`level`缓存的数据清空，`_currentLevel`会和`120`进行取模运算进行赋值。

      注意：调用`fs.xxx`方法时若传递了`options`参数，不会走缓存机制。

    - outputFileSystem
      
      普通的`graceful-fs`模块。

    - intermediateFileSystem

      普通的`graceful-fs`模块。

    - watchFileSystem

      一个`NodeWatchFileSystem`实例，（梳理watch模式时再分析）。

3. 在`beforeRun`钩子触发后重置`compiler.fsStartTime`为`Date.now()`并清理`inputFileSystem`的缓存
