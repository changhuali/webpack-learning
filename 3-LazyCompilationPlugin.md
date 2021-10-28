# LazyCompilationPlugin

**使用方式**  

`options.experiments.lazyCompilation`配置为非`falsy`时，`webpack`内部会默认加载该插件

**功能分析**

- 注册`beforeCompile`钩子
  
  钩子触发后会创建并启动一个`server`。

- 注册`thisCompilation`钩子

  - 注册在`normalModuleFactory`的`module`钩子

    将模块信息同`options.experiments.lazyCompilation`配置做匹配，匹配的模块将被实例化为一个`LazyCompilationProxyModule`实例，剩下的事情就由`normalModuleFactory`处理，我们在后面分析`normalModuleFactory`时再详细说明。

  - 执行`compilation.dependencyFactories.set(LazyCompilationDependency, new LazyCompilationDependencyFactory())`

- 注册`shutdown`钩子

  钩子触发后关闭掉之前创建的`server`。