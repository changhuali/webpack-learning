# EntryOptionPlugin

**使用方式**  

- `webpack`内部在配置`compiler`时会默认加载该插件
- `new webpack.EntryOptionPlugin()`

**功能分析**

该插件主要用于在`entryOption`钩子触发后根据`entry`的类型加载`DynamicEntryPlugin`和`EntryPlugin`两个插件

## DynamicEntryPlugin
## EntryPlugin

`DynamicEntryPlugin`会以异步方式获取`entry`，内部再利用`EntryPlugin`处理`entry`

- 在`compilation`钩子触发后执行`compilation.dependencyFactories.set(EntryDependency, normalModuleFactory)`
- 在`make`钩子触发后获取`entry`并遍历`entry`生产`EntryOptions`，再遍历`entry[name].import`生成`EntryDependency`，最后再执行`compilation.addEntry`

> 这里有多少个*入口路径*，`EntryPlugin`插件就会加载多少次，而`DynamicEntryPlugin`只会加载一次，但是最终`compilation.addEntry`执行次数都是与*入口路径*数量一致。
