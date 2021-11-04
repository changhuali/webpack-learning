# EntryOptionPlugin

**使用方式**  

- `webpack`内部在配置`compiler`时会默认加载该插件
- `new webpack.EntryOptionPlugin()`

**功能分析**

该插件主要用于在`entryOption`钩子触发后根据`entry`的类型加载`DynamicEntryPlugin`和`EntryPlugin`两个插件。

## DynamicEntryPlugin

`DynamicEntryPlugin`会以异步方式获取`entry`，内部再利用`EntryPlugin`处理`entry`。

## EntryPlugin


- 在`compilation`钩子触发后执行`compilation.dependencyFactories.set(EntryDependency, normalModuleFactory)`
- 在`make`钩子触发后获取`entry`并遍历`entry`生成`EntryOptions`，再遍历`entry[name].import`生成`EntryDependency`，最后再执行`compilation.addEntry`

> 这里有多少个*入口路径*`compilation.addEntry`就会执行多少次，一个入口可能有多个*入口路径*，比如
```js
{
  entry: {
    main: ['./a.js', 'b.js']
  }
}
```

