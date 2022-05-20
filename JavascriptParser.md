# JavascriptParser

解析模块代码为`AST`, 遍历所有`AST`节点, 根据节点类型触发对应的钩子

- ImportDeclaration

  ```js
  import "xxx";
  import xxx from "xxx"; // ImportDefaultSpecifier
  import { xxx, yyy as zzz } from "xxx"; // ImportSpecifier
  import * as xxx from "xxx"; // ImportNamespaceSpecifier
  ```

  - parser.hooks.import

    `HarmonyImportDependencyParserPlugin`插件会监听该钩子, 收到消息后会根据调用参数创建`HarmonyImportSideEffectDependency`实例, 并将该实例加入到`module.dependencies`数组中

  - parser.hooks.importSpecifier

    `HarmonyImportDependencyParserPlugin`插件会监听该钩子, 收到消息后会调用`parser.tagVariable`, 该方法会将`import`的变量构造成一个`VariableInfo`对象, 然后以`name => VariableInfo`的形式存储到 `parser.scope.definitions` 中, `JavascriptMetaInfoPlugin` 插件会在`模块解析完成后`将 `parser.scope.definitions` 中的所有变量信息存储到`module.buildInfo.topLevelDeclarations`中

```js
export * from "xxx"; // ExportAllDeclaration
export * as xxx from "xxx"; // ExportAllDeclaration
export { xxx, yyy as zzz } from "xxx"; // ExportNamedDeclaration
export { xxx, yyy as zzz }; // ExportNamedDeclaration
export const xxx = "xxx"; // ExportNamedDeclaration
export default xxx; // ExportDefaultDeclaration
```

- ExportAllDeclaration

  - parser.hooks.exportImport

    `HarmonyExportDependencyParserPlugin`插件会监听该钩子, 收到消息后会根据调用参数创建`HarmonyImportSideEffectDependency`实例, 并将该实例加入到`module.dependencies`数组中

  - parser.hooks.exportImportSpecifier

    `HarmonyExportDependencyParserPlugin`插件会监听该钩子, 收到消息后会判断导出类型是`export * as xxx from`还是`export * from`, 第一种导出方式会将`xxx`变量加入到`parser.state.harmonyNamedExports`, 第二导出方式会创建一个`HarmonyStarExportsList`实例, 最终会利用这两个东西创建一个`HarmonyExportImportedSpecifierDependency`实例, 并将该实例加入到`module.dependencies`数组中

- ExportDefaultDeclaration

  - parser.hooks.exportSpecifier(导出`function` `class`声明才会触发)

  `HarmonyExportDependencyParserPlugin`插件会监听该钩子, 收到消息后会将导出的变量加入`harmonyNamedExports`, 并将该变量标记为被`default`使用, 同时创建一个`HarmonyExportSpecifierDependency`实例, 并将该实例加入到`module.dependencies`数组中

- ExportNamedDeclaration

  - parser.hooks.exportImport(`export { xxx } from ''`导出方式会触发)

  - parser.hooks.export(`export { xxx }` or `export declaration`导出方式会触发)

  `HarmonyExportDependencyParserPlugin`插件会监听该钩子, 收到消息后会会创建`HarmonyExportHeaderDependency`实例, 并将该实例加入到`module.dependencies`数组中

  - parser.hooks.exportImportSpecifier(`export { xxx, yyy as zzz } from 'xxx'`导出方式会触发)

  - parser.hooks.exportSpecifier(`export { xxx }`导出方式会触发)

  `HarmonyExportDependencyParserPlugin`插件会监听该钩子, 收到消息后会将导出的变量加入`harmonyNamedExports`, 并将该变量标记为被`xxx`使用, 同时创建一个`HarmonyExportSpecifierDependency`实例, 并将该实例加入到`module.dependencies`数组中
