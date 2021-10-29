/**
 * webpack开发环境默认配置
 */
export default {
  amd: undefined,
  bail: undefined,
  cache: {
    type: 'memory',
    maxGenerations: Infinity,
    cacheUnaffected: experiments.cacheUnaffected,
  },
  context: process.cwd(),
  dependencies: undefined,
  devServer: undefined,
  devtool: 'eval',
  entry: {
    'name': {
      import: ['path'],
      filename?: 'FilenameTemplate',
      layer?: 'null | string',
      runtime?: 'false | string',
      publicPath?: 'auto | RawPublicPath',
      chunkLoading?: 'false | ChunkLoadingType',
      wasmLoading?: 'false | WasmLoadingType',
      dependOn?: ['name'],
      library?: 'LibraryOptions'
    }
  },
  experiments: {
    topLevelAwait: false,
    syncWebAssembly: false,
    asyncWebAssembly: false,
    outputModule: false,
    asset: false,
    layers: false,
    lazyCompilation: false,
    buildHttp: false,
    futureDefaults: false,
    cacheUnaffected: experiments.futureDefaults,
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
  externalsType: 'var',
  ignoreWarnings: undefined,
  infrastructureLogging: {
    stream: process.stderr,
    level: 'info',
    debug: false,
    colors: true,
    appendOnly: false,
  },
  loader: {
    target: 'web'
  },
  mode: undefined,
  module: {
    noParse: undefined,
    unsafeCache: module => {
			const name = module.nameForCondition();
			return name && /[\\/]node_modules[\\/]/i.test(name);
		},
    parser: {
      javascript: parserOptions => ({
        unknownContextRequest: '.',
        unknownContextRegExp: false,
        unknownContextRecursive: true,
        unknownContextCritical: true,
        exprContextRequest: '.',
        exprContextRegExp: false,
        exprContextRecursive: true,
        exprContextCritical: true,
        wrappedContextRegExp: /.*/,
        wrappedContextRecursive: true,
        wrappedContextCritical: false,
        strictExportPresence: false,
        strictThisContextOnImports: false,
        ...parserOptions
      }),
      asset: {
        dataUrlCondition: {
          maxSize: 8096,
        }
      },
    },
    generator: {},
    defaultRules: [
			{
				mimetype: "application/node",
				type: "javascript/auto"
			},
			{
				test: /\.json$/i,
				type: "json"
			},
			{
				mimetype: "application/json",
				type: "json"
			},
			{
				test: /\.mjs$/i,
				type: "javascript/esm",
        resolve: {
          byDependency: {
            esm: {
              fullySpecified: true
            }
          }
        }
			},
			{
				test: /\.js$/i,
				descriptionData: {
					type: "module"
				},
				type: "javascript/esm",
        resolve: {
          byDependency: {
            esm: {
              fullySpecified: true
            }
          }
        }
			},
			{
				test: /\.cjs$/i,
				type: "javascript/dynamic"
			},
			{
				test: /\.js$/i,
				descriptionData: {
					type: "commonjs"
				},
				type: "javascript/dynamic"
			},
			{
				mimetype: {
					or: ["text/javascript", "application/javascript"]
				},
				type: "javascript/esm",
        resolve: {
          byDependency: {
            esm: {
              fullySpecified: true
            }
          }
        }
			},
      asyncWebAssembly && {
        test: /\.wasm$/i,
        type: "webassembly/async",
        rules: [
          {
            descriptionData: {
              type: "module"
            },
            resolve: {
              fullySpecified: true
            }
          }
        ]
      },
      asyncWebAssembly && {
        mimetype: "application/wasm",
        type: "webassembly/async",
        rules: [
          {
            descriptionData: {
              type: "module"
            },
            resolve: {
              fullySpecified: true
            }
          }
        ]
      },
      syncWebAssembly && {
        test: /\.wasm$/i,
        type: "webassembly/sync",
				rules: [
					{
						descriptionData: {
							type: "module"
						},
						resolve: {
							fullySpecified: true
						}
					}
				]
      },
      syncWebAssembly && {
        mimetype: "application/wasm",
        type: "webassembly/sync",
				rules: [
					{
						descriptionData: {
							type: "module"
						},
						resolve: {
							fullySpecified: true
						}
					}
				]
      },
      {
				dependency: "url",
				oneOf: [
					{
						scheme: /^data$/,
						type: "asset/inline"
					},
					{
						type: "asset/resource"
					}
				]
			},
			{
				assert: { type: "json" },
				type: "json"
			}
		],
    rules: []
  },
  name: undefined,
  node: {
    global: futureDefaults ? "warn" : true,
    __filename: futureDefaults ? "warn-mock" : "mock",
    __dirname: futureDefaults ? "warn-mock" : "mock",
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    flagIncludedChunks: false,
    moduleIds: 'named',
    chunkIds: 'deterministic',
    sideEffects: 'flag',
    providedExports: true,
    usedExports: false,
    innerGraph: false,
    mangleExports: false,
    concatenateModules: false,
    runtimeChunk: false,
    emitOnErrors: true,
    checkWasmTypes: false,
    mangleWasmImports: false,
    portableRecords: false,
    realContentHash: false,
    minimize: false,
    minimizer: [
      {
        apply: compiler => {
          const TerserPlugin = require("terser-webpack-plugin");
          new TerserPlugin({
            terserOptions: {
              compress: {
                passes: 2
              }
            }
          }).apply(compiler);
        }
      }
    ],
    nodeEnv: 'development',
    splitChunks: {
      defaultSizeTypes: ["...", "javascript", "unknown"],
      hidePathInfo: false,
      chunks: 'async',
      usedExports: false,
      minChunks: 1,
      minSize: 10000,
      minRemainingSize: 0,
      enforceSizeThreshold: 30000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      automaticNameDelimiter: '-',
      cacheGroups: {
        default: {
          idHint: "",
          reuseExistingChunk: true,
          minChunks: 2,
          priority: -20
        },
        defaultVendors: {
          idHint: "vendors",
          reuseExistingChunk: true,
          test: /[\\/]node_modules[\\/]/i,
          priority: -10
        }
      }
    },
  },
  output: {
    assetModuleFilename: '[hash][ext][query]',
    charset: true,
    chunkFilename: output.filename,
    chunkFormat: 'array-push',
    chunkLoading: 'jsonp',
    chunkLoadingGlobal: `webpackChunk${output.uniqueName}`,
    chunkLoadTimeout: 120000,
    clean: undefined,
    compareBeforeEmit: true,
    crossOriginLoading: false,
    devtoolFallbackModuleFilenameTemplate: undefined,
    devtoolModuleFilenameTemplate: undefined,
    devtoolNamespace: output.uniqueName,
    environment: {
      arrowFunction: true,
      const: true,
      destructuring: true,
      forOf: true,
      bigIntLiteral: true,
      dynamicImport: true,
      module: true,
    },
    enabledChunkLoadingTypes: ["...", 'jsonp', 'import-scripts'],
    enabledLibraryTypes: ["..."],
    enabledWasmLoadingTypes: ["...", 'fetch'],
    filename: output.module ? "[name].mjs" : "[name].js",
    globalObject: 'self',
    hashDigest: 'hex',
    hashDigestLength: 20,
    hashFunction: options.experiments.futureDefaults ? "xxhash64" : "md4",
    hashSalt: undefined,
    hotUpdateChunkFilename: `[id].[fullhash].hot-update.${output.module ? "mjs" : "js"}`,
    hotUpdateGlobal: `webpackHotUpdate${output.uniqueName}`,
    hotUpdateMainFilename: '[runtime].[fullhash].hot-update.json',
    iife: !output.module,
    importFunctionName: 'import',
    importMetaName: 'import.meta',
    scriptType: output.module ? "module" : false,
    library: undefined,
    module: options.experiments.outputModule,
    path: path.join(process.cwd(), "dist"),
    pathinfo: true,
    publicPath: 'auto',
    sourceMapFilename: '[file].map[query]',
    sourcePrefix: undefined,
    strictModuleExceptionHandling: false,
    trustedTypes: undefined,
    uniqueName: packageInfo.name,
    wasmLoading: 'fetch',
    webassemblyModuleFilename: '[hash].module.wasm',
    workerChunkLoading: 'import-scripts',
    workerWasmLoading: 'fetch',
  },
  parallelism: 100,
  performance: false,
  plugins: [],
  profile: false,
  recordsInputPath: false,
  recordsOutputPath: false,
  resolve: {
		cache: true,
		modules: ["node_modules"],
		conditionNames: ["webpack", 'development', 'browser'],
		mainFiles: ["index"],
		extensions: [],
		aliasFields: [],
		exportsFields: ["exports"],
		roots: [process.cwd()],
		mainFields: ["main"],
		byDependency: {
			wasm: {
        aliasFields: browserField ? ["browser"] : [],
        mainFields: browserField ? ["browser", "module", "..."] : ["module", "..."],
        conditionNames: ["import", "module", "..."],
        extensions: [".js", ".json", ".wasm"]
      },
			esm: {
        aliasFields: browserField ? ["browser"] : [],
        mainFields: browserField ? ["browser", "module", "..."] : ["module", "..."],
        conditionNames: ["import", "module", "..."],
        extensions: [".js", ".json", ".wasm"]
      },
			loaderImport: {
        aliasFields: browserField ? ["browser"] : [],
        mainFields: browserField ? ["browser", "module", "..."] : ["module", "..."],
        conditionNames: ["import", "module", "..."],
        extensions: [".js", ".json", ".wasm"]
      },
			url: {
				preferRelative: true
			},
			worker: {
				aliasFields: browserField ? ["browser"] : [],
        mainFields: browserField ? ["browser", "module", "..."] : ["module", "..."],
        conditionNames: ["import", "module", "..."],
        extensions: [".js", ".json", ".wasm"],
				preferRelative: true
			},
			commonjs: {
        aliasFields: browserField ? ["browser"] : [],
        mainFields: browserField ? ["browser", "module", "..."] : ["module", "..."],
        conditionNames: ["require", "module", "..."],
        extensions: [...jsExtensions]
	    },
			amd: {
        aliasFields: browserField ? ["browser"] : [],
        mainFields: browserField ? ["browser", "module", "..."] : ["module", "..."],
        conditionNames: ["require", "module", "..."],
        extensions: [...jsExtensions]
	    },
			loader: {
        aliasFields: browserField ? ["browser"] : [],
        mainFields: browserField ? ["browser", "module", "..."] : ["module", "..."],
        conditionNames: ["require", "module", "..."],
        extensions: [...jsExtensions]
	    },
			unknown: {
        aliasFields: browserField ? ["browser"] : [],
        mainFields: browserField ? ["browser", "module", "..."] : ["module", "..."],
        conditionNames: ["require", "module", "..."],
        extensions: [...jsExtensions]
	    },
			undefined: {
        aliasFields: browserField ? ["browser"] : [],
        mainFields: browserField ? ["browser", "module", "..."] : ["module", "..."],
        conditionNames: ["require", "module", "..."],
        extensions: [...jsExtensions]
    	}
		}
	},
  resolveLoader: {
		cache: true,
		conditionNames: ["loader", "require", "node"],
		exportsFields: ["exports"],
		mainFields: ["loader", "main"],
		extensions: [".js"],
		mainFiles: ["index"]
	},
  snapshot: {
    resolveBuildDependencies: {
      timestamp: true,
      hash: true
    },
    buildDependencies: {
      timestamp: true,
      hash: true
    },
    resolve: {
      timestamp: true,
    },
    module: {
      timestamp: true,
    },
    immutablePaths: [],
    managedPaths: []
  },
  stats: {},
  target: 'web',
  watch: false,
  watchOptions: {}
}