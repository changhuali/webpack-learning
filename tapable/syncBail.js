const { SyncBailHook } = require("tapable");

const hook = new SyncBailHook(["test"]);

hook.tap("Test", (...args) => {
  console.log(args, "2");
  return true;
});
hook.tap("Test", (...args) => {
  console.log(args, "1");
});

hook.call();
console.log("pre");

// 所有代码全部同步顺序执行，若有返回结果，后续回调不会被执行
