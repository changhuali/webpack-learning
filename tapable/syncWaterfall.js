const { SyncWaterfallHook } = require("tapable");

const hook = new SyncWaterfallHook(["test"]);

hook.tap("Test", (...args) => {
  console.log(args, "2");
  return true;
});
hook.tap("Test", (...args) => {
  console.log(args, "1");
});

hook.call(1);
console.log("pre");

// 所有代码全部同步顺序执行，上一个回调的返回值会作为下一个回调的入参，同时call参数只对第一个回调生效