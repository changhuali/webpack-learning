const { AsyncSeriesHook } = require("tapable");

const hook = new AsyncSeriesHook();


hook.callAsync(() => {
  console.log("done");
});
hook.tapAsync("Test", (arg) => {
  console.log(arg, "1");
  arg()
  setTimeout(() => {
  })
});
hook.tapAsync("Test", (arg) => {
  console.log(arg, "2");
  arg()
  setTimeout(() => {
  })
});


console.log("pre");



// 所有代码全部同步顺序执行，但若有异步代码，则会异步执行
