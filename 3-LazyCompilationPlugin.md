# LazyCompilationPlugin

- 注册`beforeCompile`钩子
  
  钩子触发后会创建并启动一个`server`。

- 注册`thisCompilation`钩子

  - 注册在`normalModuleFactory`的`module`钩子

    将模块信息同`options.experiments.lazyCompilation`配置做匹配，匹配的模块将被实例化为一个`LazyCompilationProxyModule`实例，再交给`normalModuleFactory`处理。

  - 执行`compilation.dependencyFactories.set(LazyCompilationDependency, new LazyCompilationDependencyFactory())`

- 注册`shutdown`钩子

  钩子触发后关闭掉之前创建的`server`。