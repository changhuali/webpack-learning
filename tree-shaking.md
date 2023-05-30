# tree-shaking

webpack内部通过多个插件实现了自己的tree-shaking, 主要插件有

## SideEffectsFlagPlugin

> 通过`optimization.sideEffects`开启

1. `optimization.sideEffects`为`true`时，该插件会调用`parser.isPure`方法对每个模块`顶层作用域中的代码语句`遍历进行分析，若任一语句的`parser.isPure`返回`false`则停止分析，否则，会将`module.buildMeta.sideEffectFree`设置为`true`，表明该模块不具有副作用。

2. 调用静态方法`moduleHasSideEffects`分析模块对应的`package.json`中的`sideEffects`属性，根据该属性值的类型做不同操作：
- undefined 返回 true
- boolean 直接返回sideEffects的值
- string 以`glob`方式去匹配模块路径，返回一个bool值
- object 由`glob`组成的数组，递归判断
可见以上判断最终会返回一个`bool`值，表示该模块是否具有副作用，并保存到`module.factoryMeta.sideEffectFree`。

3. 获取`module.rules`中被匹配到的`sideEffects`值，如果值是一个`bool`值，表示该模块是否具有副作用，并保存到`module.factoryMeta.sideEffectFree`（会覆盖第2步的设置）。