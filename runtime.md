# runtime

`webpack`会提供一些运行时代码，用于处理`import` `require`语法。

## 代码分析

```js
(() => {

  "use strict"
  
  // 所有依赖模块都会以key value的形式存储到__webpack_modules__上
  var __webpack_modules__ = {
    // key是模块路径， value是一个函数，执行value函数会执行依赖模块的代码，并且将依赖模块export的内容以key value的形式挂载到__webpack_exports__上
    'module1_path': (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__)
      __webpack_require__.d(__webpack_exports__, {
        'default': () => __WEBPACK_DEFAULT_EXPORT__,
        'export_name': () => 'export_value'
      })
      'module1 content without export'
      const __WEBPACK_DEFAULT_EXPORT__ = 'export_default'
    },
  }

  // 将加载过的模块以key value的形式缓存到__webpack_module_cache__，key是模块路径，value是一个module对象
  var __webpack_module_cache__ = {}
  function __webpack_require__(moduleId) {
    // 优先从缓存读取
    var cachedModule = __webpack_module_cache__[moduleId]
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }

    // 构造一个module对象作为容器接受模块export的结果
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    }
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__)

    return module.exports
  }

  // 将输入结果definition挂载到exports上
  (() => {
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
          Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
        }
      }
    }
  })()

  // 判断属性prop是否为obj对象自身的属性
  (() => {
    __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
  })()

  // 标识__webpack_require__的结果为一个Module对象或者一个es6模块
  (() => {
    __webpack_require__.r = (exports) => {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
      }
      Object.defineProperty(exports, '__esModule', { value: true })
    }
  })()

})()
```

## 总结

`webpack`通过提供内置的运行时代码来将各个模块组织到一起，模块输出内容是在调用`__webpack_require__`后动态挂载到一个`module`对象上面的。

