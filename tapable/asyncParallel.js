const { AsyncParallelHook } = require("tapable");

const hook = new AsyncParallelHook();


hook.tapAsync("Test", (cc, arg) => {
  console.log(arg, "1");
  setTimeout(() => {
    arg()
  }, 3000)
});
hook.tapAsync("Test", (cc, arg) => {
  console.log(arg, "2");
  setTimeout(() => {
    arg()
  }, 3000)
});

hook.callAsync(222, () => {
  console.log("done");
});
console.log("pre");



// 所有代码全部同步顺序执行，但若有异步代码，则会异步执行
