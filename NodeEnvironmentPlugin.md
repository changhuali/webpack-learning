# NodeEnvironmentPlugin

官方解释：将Node.js格式的文件系统应用到compiler。

该插件主要做了两件事

1. 初始化了`compiler`的`infrastructureLogger`属性

    自定义的一套日志打印系统，基于`process.stderr.write`实现，支持debug模式、控制日志打印级别、日志颜色开关。

2. 初始化了`compiler`的文件系统

    `compiler`与文件系统打交道的主要是下面4个属性，这四个属性均是基于`graceful-fs`包实现的。

    - inputFileSystem

      一个`CachedInputFileSystem`实例，该类内部通过拦截`lstat`、`stat`、`readdir`、`readFile`、`readJson`等方法实现了一套缓存机制。

      缓存实现：同类方法（同个方法的同步xxx和异步实现xxxSync）挂载到同一个`CacheBackend`实例上，该实例内部维护了一个`Map`实例，以`path`为`key`，文件返回结果为`value`，并且该类实现了`purge`方法，可以通过该方法清理缓存。

      缓存清除策略：CacheBackend实例内部保存了一个私有的`_levels`属性，其类型为`Set<Path>[]`(长度为`120`)，用来存储所有的`path`，以`500ms`为一个`tick`，用私有属性`_currentLevel`保存当前的`tick`序号，同一个`tick`期间所有未命中缓存的请求都将存储到`this._levels[this._currentLevel]`，并将下一个`level`缓存的数据清空，`_currentLevel`会和`120`进行取模运算进行赋值。

      注意：传递了`options`参数时，缓存机制不会生效。

    - outputFileSystem
      
      普通的`graceful-fs`模块。

    - intermediateFileSystem

      普通的`graceful-fs`模块。

    - watchFileSystem

      一个`NodeWatchFileSystem`实例，（暂不分析）。
