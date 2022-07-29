# entry

## compilation.entries

**type**

```ts
Map<string, EntryData>
```

```ts
interface EntryData {
  /** 入口的所有import */
  dependencies: Dependency[];
  /** 未知 */
  includeDependencies: Dependency[];
  /** 入口的配置 */
  options: {
    /** 入口名(entry的key) */
    name: string;
    /** 最终打包后输出的路径，必须是相对路径 */
    filename?:
      | string
      | ((
          pathData: Compilation.PathData,
          assetInfo?: Compilation.AssetInfo,
        ) => string);
    /** webpack runtime chunk的名称(多个入口可通过设置同名复用？) */
    runtime?: false | string;
    /** 指定属于此入口的所有modules应该放到哪里(类似分组的概念？) */
    layer?: null | string;
    /** 入口的依赖入口，入口加载前，依赖入口会先加载 */
    dependOn?: string[];
    /** 入口的base uri(webpack会分析代码，判断入口是否需要设置base uri) */
    baseUri?: string;
    /** 指定浏览器引用此入口所有的chunks时应使用的publicPath */
    publicPath?:
      | 'auto'
      | string
      | ((
          pathData: Compilation.PathData,
          assetInfo?: Compilation.AssetInfo,
        ) => string);
    /** 指定此入口所有chunks加载方式(其他值需通过插件拓展) */
    chunkLoading?:
      | false
      | 'jsonp'
      | 'import-scripts'
      | 'require'
      | 'async-node'
      | 'import'
      | string;
    /** 是否启用/禁用创建可按需加载的异步chunks */
    asyncChunks?: boolean;
    /** 指定加载WebAssembly模块的方法(其他值需通过插件拓展) */
    wasmLoading?: false | 'fetch-streaming' | 'fetch' | 'async-node' | string;
    library?: {
      /**
       * 为UMD代码添加注释
       */
      auxiliaryComment?:
        | string
        | {
            amd?: string;
            commonjs?: string;
            commonjs2?: string;
            root?: string;
          };
      /** 指定哪些export变量需要暴露给library */
      export?: string[] | string;
      /** 指定library的变量名 */
      name?:
        | string[]
        | string
        | {
            amd?: string;
            commonjs?: string;
            root?: string[] | string;
          };
      /** 指定library的类型，其他类型需要通过插件支持 */
      type:
        | (
            | 'var'
            | 'module'
            | 'assign'
            | 'assign-properties'
            | 'this'
            | 'window'
            | 'self'
            | 'global'
            | 'commonjs'
            | 'commonjs2'
            | 'commonjs-module'
            | 'commonjs-static'
            | 'amd'
            | 'amd-require'
            | 'umd'
            | 'umd2'
            | 'jsonp'
            | 'system'
          )
        | string;
      /**
       * If `output.libraryTarget` is set to umd and `output.library` is set, setting this to true will name the AMD module.
       */
      umdNamedDefine?: boolean;
    };
  };
}
```
