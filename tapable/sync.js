const { SyncHook } = require("tapable");

const hook = new SyncHook();

hook.tap("Test", (...args) => {
  console.log(args, '2');
});
hook.tap("Test", (...args) => {
  console.log(args, '1');
});

hook.call();
console.log('pre')


// 所有代码全部同步顺序执行