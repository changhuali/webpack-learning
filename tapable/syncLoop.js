const { SyncLoopHook } = require("tapable");

const hook = new SyncLoopHook(["test"]);

hook.tap("Test", (...args) => {
  console.log(args, "1");
});
hook.tap("Test", (...args) => {
  console.log(args, "2");
});
hook.tap("Test", (...args) => {
  console.log(args, "3");
  return 1;
});

hook.call("aaa");
console.log("pre");

// 所有代码全部同步顺序执行，若有返回结果，则会从第一个回调开始执行
