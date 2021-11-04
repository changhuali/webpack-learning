# JsonpChunkLoadingPlugin
# ImportScriptsChunkLoadingPlugin
# CommonJsChunkLoadingPlugin
# ModuleChunkLoadingPlugin

- 注册`thisCompilation`钩子
  
  注册`compilation.hooks.runtimeRequirementInTree`相关钩子，并在相关钩子触发后为执行`compilation.addRuntimeModule`

## compilation.addRuntimeModule

