/**
 * webpack开发环境默认配置
 */
export default {
  amd: undefined,
  bail: undefined,
  cache: {
    type: "memory",
    maxGenerations: Infinity,
    cacheUnaffected: false,
  },
  context: "/Users/hjmac04/Desktop/webpack-learning/examples/base",
  dependencies: undefined,
  devServer: undefined,
  devtool: "eval",
  entry: {
    page1: {
      import: ["./src/page1"],
    },
  },
  experiments: {
    buildHttp: undefined,
    lazyCompilation: undefined,
    css: undefined,
    futureDefaults: false,
    backCompat: true,
    topLevelAwait: false,
    syncWebAssembly: false,
    asyncWebAssembly: false,
    outputModule: false,
    layers: false,
    cacheUnaffected: false,
  },
  externals: undefined,
  externalsPresets: {
    web: true,
    node: false,
    nwjs: false,
    electron: false,
    electronMain: false,
    electronPreload: false,
    electronRenderer: false,
  },
  externalsType: "var",
  ignoreWarnings: undefined,
  infrastructureLogging: {
    level: "info",
    debug: false,
    colors: undefined,
    appendOnly: true,
  },
  loader: {
    target: "web",
  },
  mode: "development",
  module: {
    noParse: undefined,
    unsafeCache: (module) => {
      const name = module.nameForCondition();
      return name && NODE_MODULES_REGEXP.test(name);
    },
    parser: {
      javascript: {
        unknownContextRequest: ".",
        unknownContextRegExp: false,
        unknownContextRecursive: true,
        unknownContextCritical: true,
        exprContextRequest: ".",
        exprContextRegExp: false,
        exprContextRecursive: true,
        exprContextCritical: true,
        wrappedContextRegExp: {},
        wrappedContextRecursive: true,
        wrappedContextCritical: false,
        strictExportPresence: undefined,
        strictThisContextOnImports: false,
        importMeta: true,
      },
      asset: {
        dataUrlCondition: {
          maxSize: 8096,
        },
      },
    },
    generator: {},
    defaultRules: [
      {
        mimetype: "application/node",
        type: "javascript/auto",
      },
      {
        test: {},
        type: "json",
      },
      {
        mimetype: "application/json",
        type: "json",
      },
      {
        test: {},
        type: "javascript/esm",
        resolve: {
          byDependency: {
            esm: {
              fullySpecified: true,
            },
          },
        },
      },
      {
        test: {},
        descriptionData: {
          type: "module",
        },
        type: "javascript/esm",
        resolve: {
          byDependency: {
            esm: {
              fullySpecified: true,
            },
          },
        },
      },
      {
        test: {},
        type: "javascript/dynamic",
      },
      {
        test: {},
        descriptionData: {
          type: "commonjs",
        },
        type: "javascript/dynamic",
      },
      {
        mimetype: {
          or: ["text/javascript", "application/javascript"],
        },
        type: "javascript/esm",
        resolve: {
          byDependency: {
            esm: {
              fullySpecified: true,
            },
          },
        },
      },
      {
        dependency: "url",
        oneOf: [
          {
            scheme: {},
            type: "asset/inline",
          },
          {
            type: "asset/resource",
          },
        ],
      },
      {
        assert: {
          type: "json",
        },
        type: "json",
      },
    ],
    rules: [],
  },
  name: undefined,
  node: {
    global: true,
    __filename: "mock",
    __dirname: "mock",
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      defaultSizeTypes: ["javascript", "unknown"],
      cacheGroups: {
        default: {
          idHint: "",
          reuseExistingChunk: true,
          minChunks: 2,
          priority: -20,
        },
        defaultVendors: {
          idHint: "vendors",
          reuseExistingChunk: true,
          test: {},
          priority: -10,
        },
      },
      hidePathInfo: false,
      chunks: "async",
      usedExports: false,
      minChunks: 1,
      minSize: 10000,
      minRemainingSize: 0,
      enforceSizeThreshold: 30000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      automaticNameDelimiter: "-",
    },
    emitOnErrors: true,
    removeAvailableModules: false,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    flagIncludedChunks: false,
    moduleIds: "named",
    chunkIds: "named",
    sideEffects: "flag",
    providedExports: true,
    usedExports: false,
    innerGraph: false,
    mangleExports: false,
    concatenateModules: false,
    checkWasmTypes: false,
    mangleWasmImports: false,
    portableRecords: false,
    realContentHash: false,
    minimize: false,
    minimizer: [
      {
        apply: (compiler) => {
          // Lazy load the Terser plugin
          const TerserPlugin = require("terser-webpack-plugin");
          new TerserPlugin({
            terserOptions: {
              compress: {
                passes: 2,
              },
            },
          }).apply(compiler);
        },
      },
    ],
    nodeEnv: "development",
  },
  output: {
    assetModuleFilename: "[hash][ext][query]",
    asyncChunks: true,
    charset: true,
    chunkFilename: "[name].js",
    chunkFormat: "array-push",
    chunkLoading: "jsonp",
    chunkLoadingGlobal: "webpackChunkbase",
    chunkLoadTimeout: 120000,
    cssFilename: "[name].css",
    cssChunkFilename: "[name].css",
    clean: undefined,
    compareBeforeEmit: true,
    crossOriginLoading: false,
    devtoolFallbackModuleFilenameTemplate: undefined,
    devtoolModuleFilenameTemplate: undefined,
    devtoolNamespace: "base",
    environment: {
      arrowFunction: true,
      const: true,
      destructuring: true,
      forOf: true,
      bigIntLiteral: undefined,
      dynamicImport: undefined,
      module: undefined,
    },
    enabledChunkLoadingTypes: ["jsonp", "import-scripts"],
    enabledLibraryTypes: [],
    enabledWasmLoadingTypes: ["fetch"],
    filename: "[name].js",
    globalObject: "self",
    hashDigest: "hex",
    hashDigestLength: 20,
    hashFunction: "md4",
    hashSalt: undefined,
    hotUpdateChunkFilename: "[id].[fullhash].hot-update.js",
    hotUpdateGlobal: "webpackHotUpdatebase",
    hotUpdateMainFilename: "[runtime].[fullhash].hot-update.json",
    iife: true,
    importFunctionName: "import",
    importMetaName: "import.meta",
    scriptType: false,
    library: undefined,
    module: false,
    path: "/Users/hjmac04/Desktop/webpack-learning/dist",
    pathinfo: true,
    publicPath: "auto",
    sourceMapFilename: "[file].map[query]",
    sourcePrefix: undefined,
    strictModuleExceptionHandling: false,
    trustedTypes: undefined,
    uniqueName: "base",
    wasmLoading: "fetch",
    webassemblyModuleFilename: "[hash].module.wasm",
    workerChunkLoading: "import-scripts",
    workerWasmLoading: "fetch",
  },
  parallelism: 100,
  performance: false,
  plugins: [],
  profile: false,
  recordsInputPath: false,
  recordsOutputPath: false,
  resolve: {
    byDependency: {
      wasm: {
        conditionNames: ["import", "module", "..."],
        extensions: [".js", ".json", ".wasm"],
        aliasFields: ["browser"],
        mainFields: ["browser", "module", "..."],
      },
      esm: {
        conditionNames: ["import", "module", "..."],
        extensions: [".js", ".json", ".wasm"],
        aliasFields: ["browser"],
        mainFields: ["browser", "module", "..."],
      },
      loaderImport: {
        conditionNames: ["import", "module", "..."],
        extensions: [".js", ".json", ".wasm"],
        aliasFields: ["browser"],
        mainFields: ["browser", "module", "..."],
      },
      worker: {
        conditionNames: ["import", "module", "..."],
        extensions: [".js", ".json", ".wasm"],
        aliasFields: ["browser"],
        mainFields: ["browser", "module", "..."],
        preferRelative: true,
      },
      commonjs: {
        conditionNames: ["require", "module", "..."],
        extensions: [".js", ".json", ".wasm"],
        aliasFields: ["browser"],
        mainFields: ["browser", "module", "..."],
      },
      amd: {
        conditionNames: ["require", "module", "..."],
        extensions: [".js", ".json", ".wasm"],
        aliasFields: ["browser"],
        mainFields: ["browser", "module", "..."],
      },
      loader: {
        conditionNames: ["require", "module", "..."],
        extensions: [".js", ".json", ".wasm"],
        aliasFields: ["browser"],
        mainFields: ["browser", "module", "..."],
      },
      unknown: {
        conditionNames: ["require", "module", "..."],
        extensions: [".js", ".json", ".wasm"],
        aliasFields: ["browser"],
        mainFields: ["browser", "module", "..."],
      },
      undefined: {
        conditionNames: ["require", "module", "..."],
        extensions: [".js", ".json", ".wasm"],
        aliasFields: ["browser"],
        mainFields: ["browser", "module", "..."],
      },
      url: {
        preferRelative: true,
      },
    },
    cache: true,
    modules: ["node_modules"],
    conditionNames: ["webpack", "development", "browser"],
    mainFiles: ["index"],
    extensions: [],
    aliasFields: [],
    exportsFields: ["exports"],
    roots: ["/Users/hjmac04/Desktop/webpack-learning/examples/base"],
    mainFields: ["main"],
  },
  resolveLoader: {
    cache: true,
    conditionNames: ["loader", "require", "node"],
    exportsFields: ["exports"],
    mainFields: ["loader", "main"],
    extensions: [".js"],
    mainFiles: ["index"],
  },
  snapshot: {
    resolveBuildDependencies: {
      timestamp: true,
      hash: true,
    },
    buildDependencies: {
      timestamp: true,
      hash: true,
    },
    resolve: {
      timestamp: true,
    },
    module: {
      timestamp: true,
    },
    immutablePaths: [],
    managedPaths: ["/Users/hjmac04/Desktop/webpack/node_modules/"],
  },
  stats: {},
  target: "web",
  watch: false,
  watchOptions: {},
};
