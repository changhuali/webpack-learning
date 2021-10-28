# ExternalsPlugin

**使用方式**  

- `options.externals`配置为非`falsy`时，`webpack`内部会默认加载该插件
- `new webpack.ExternalsPlugin(externalsType, externals)`

**功能分析**

- 注册`compile`钩子
  
  通过该钩子拿到`normalModuleFactory`

- 加载插件`ExternalModuleFactoryPlugin`处理`normalModuleFactory`

## ExternalModuleFactoryPlugin

- 注册`normalModuleFactory`的`factorize`钩子
 
  将模块信息同`options.externals`配置做匹配，匹配的模块将被实例化为一个`ExternalModule`实例，剩下的事情就由`normalModuleFactory`处理，我们在后面分析`normalModuleFactory`时再详细说明。