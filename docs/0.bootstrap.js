(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var wasm_game_of_life__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! wasm-game-of-life */ \"./pkg/wasm_game_of_life.js\");\n/* harmony import */ var wasm_game_of_life_wasm_game_of_life_bg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wasm-game-of-life/wasm_game_of_life_bg */ \"./pkg/wasm_game_of_life_bg.wasm\");\n\r\n\r\n\r\nconst CELL_SIZE = 10;\r\nconst GRID_COLOR = \"#000\";\r\nconst DEAD_COLOR = \"#000\";\r\nlet ALIVE_COLOR = getRandomColor();\r\n\r\nconst canvas = document.getElementById(\"game-of-life-canvas\");\r\nconst reset = document.getElementById(\"reset\");\r\nconst play = document.getElementById(\"toggle\");\r\nconst autogen = document.getElementById(\"auto\");\r\nconst gen = document.getElementById(\"gen\");\r\nconst toolbar = document.getElementById(\"tools\");\r\n\r\nconst loader = document.getElementById(\"loading\");\r\nconst ctx = canvas.getContext(\"2d\");\r\n\r\nlet universe = wasm_game_of_life__WEBPACK_IMPORTED_MODULE_0__[\"Universe\"].new();\r\nlet epoch = 1;\r\nlet auto = false;\r\nlet stats = undefined;\r\n\r\nconst width = universe.width();\r\nconst height = universe.height();\r\n\r\ncanvas.height = (CELL_SIZE + 1) * height + 1;\r\ncanvas.width = (CELL_SIZE + 1) * width + 1;\r\n\r\nlet running = false;\r\n\r\nfunction getRandomColor(minBrightness = 50) {\r\n  while (true) {\r\n    // Generate random integer representing a color\r\n    const randomColor = Math.floor(Math.random() * 16777215);\r\n\r\n    // Ensure 6-character hex string with padding\r\n    const hexColor = \"#\" + randomColor.toString(16).padStart(6, \"0\");\r\n\r\n    // Convert hex to RGB (ignoring alpha channel)\r\n    const r = parseInt(hexColor.slice(1, 3), 16);\r\n    const g = parseInt(hexColor.slice(3, 5), 16);\r\n    const b = parseInt(hexColor.slice(5, 7), 16);\r\n\r\n    // Calculate normalized brightness (avoiding division by zero)\r\n    const brightness = Math.max((r + g + b) / (255 * 3), 0);\r\n\r\n    if (brightness >= minBrightness / 100) {\r\n      return hexColor;\r\n    }\r\n  }\r\n}\r\n\r\nfunction hexToRgba(hexCode, alpha = 1) {\r\n  if (!hexCode || hexCode.length !== 7) {\r\n    throw new Error(\"Invalid hex code provided.\");\r\n  }\r\n\r\n  const r = parseInt(hexCode.slice(1, 3), 16);\r\n  const g = parseInt(hexCode.slice(3, 5), 16);\r\n  const b = parseInt(hexCode.slice(5, 7), 16);\r\n  return `rgba(${r}, ${g}, ${b}, ${alpha})`;\r\n}\r\n\r\nconst getIndex = (row, column) => {\r\n  return row * width + column;\r\n};\r\n\r\nconst drawCells = () => {\r\n  const cellsPtr = universe.cells_ptr();\r\n\r\n  // This is updated!\r\n  const cells = new Uint8Array(wasm_game_of_life_wasm_game_of_life_bg__WEBPACK_IMPORTED_MODULE_1__[\"memory\"].buffer, cellsPtr, (width * height) / 8);\r\n\r\n  ctx.beginPath();\r\n\r\n  for (let row = 0; row < height; row++) {\r\n    for (let col = 0; col < width; col++) {\r\n      const idx = getIndex(row, col);\r\n\r\n      // This is updated!\r\n      ctx.fillStyle = bitIsSet(idx, cells) ? ALIVE_COLOR : DEAD_COLOR;\r\n\r\n      ctx.fillRect(\r\n        col * (CELL_SIZE + 1) + 1,\r\n        row * (CELL_SIZE + 1) + 1,\r\n        CELL_SIZE,\r\n        CELL_SIZE\r\n      );\r\n    }\r\n  }\r\n\r\n  ctx.stroke();\r\n};\r\n\r\nconst drawGrid = () => {\r\n  ctx.beginPath();\r\n  ctx.strokeStyle = GRID_COLOR;\r\n\r\n  // Vertical lines.\r\n  for (let i = 0; i <= width; i++) {\r\n    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);\r\n    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);\r\n  }\r\n\r\n  // Horizontal lines.\r\n  for (let j = 0; j <= height; j++) {\r\n    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);\r\n    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);\r\n  }\r\n\r\n  ctx.stroke();\r\n};\r\n\r\nconst renderLoop = () => {\r\n  if (universe.get_epoch()) {\r\n    if (auto) {\r\n      reset.click();\r\n      return;\r\n    } else {\r\n      running = false;\r\n      play.innerText = \"run\";\r\n      updateStatus();\r\n      return;\r\n    }\r\n  }\r\n\r\n  if (!running) return;\r\n\r\n  universe.tick();\r\n  drawGrid();\r\n  drawCells();\r\n  updateStatus();\r\n  requestAnimationFrame(renderLoop);\r\n};\r\n\r\nconst bitIsSet = (n, arr) => {\r\n  const byte = Math.floor(n / 8);\r\n  const mask = 1 << n % 8;\r\n  return (arr[byte] & mask) === mask;\r\n};\r\n\r\nconst updateStatus = () => {\r\n  gen.innerText = \"\";\r\n  gen.innerText += `Epoch: ${epoch} ${auto ? \" [auto-generated]\" : \"\"}\\n`;\r\n  gen.innerText += `Generation: ${universe.get_gen()}\\n`;\r\n  gen.innerText += running\r\n    ? `[running]`\r\n    : universe.get_epoch()\r\n    ? `[epoch expired]`\r\n    : `[paused]\\n`;\r\n};\r\n\r\nconst wasmSupported = (() => {\r\n  try {\r\n    if (\r\n      typeof WebAssembly === \"object\" &&\r\n      typeof WebAssembly.instantiate === \"function\"\r\n    ) {\r\n      const module = new WebAssembly.Module(\r\n        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)\r\n      );\r\n      if (module instanceof WebAssembly.Module)\r\n        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;\r\n    }\r\n  } catch (e) {}\r\n  return false;\r\n})();\r\n\r\nconst pageLoaded = () => {\r\n  while (stats === undefined) {\r\n    stats = document.getElementById(\"stats\");\r\n  }\r\n\r\n  stats.style.position = \"relative\";\r\n  stats.style.border = \"1px solid rgba(50, 50, 50, 0.8)\";\r\n  autogen.style.border = \"1px solid rgba(225,0,0,0.5)\";\r\n  autogen.style.backgroundColor = \"rgba(225,0,0,0.2)\";\r\n\r\n  /*******************************************************************************\r\n   * Event Listeners\r\n   *******************************************************************************/\r\n\r\n  autogen.addEventListener(\"mouseover\", () => {\r\n    // Change button styles on hover\r\n\r\n    if (auto) {\r\n      autogen.style.border = \"1px solid rgba(225,0,0,0.5)\";\r\n      autogen.style.backgroundColor = \"rgba(225,0,0,0.2)\";\r\n    }\r\n    if (!auto) {\r\n      autogen.style.border = \"1px solid rgba(0,255,0,0.5)\";\r\n      autogen.style.backgroundColor = \"rgba(0,255,0,0.2)\";\r\n    }\r\n  });\r\n\r\n  autogen.addEventListener(\"mouseout\", () => {\r\n    // Change button styles back to original on mouseout\r\n    if (!auto) {\r\n      autogen.style.border = \"1px solid rgba(225,0,0,0.5)\";\r\n      autogen.style.backgroundColor = \"rgba(225,0,0,0.2)\";\r\n    }\r\n    if (auto) {\r\n      autogen.style.border = \"1px solid rgba(0,255,0,0.5)\";\r\n      autogen.style.backgroundColor = \"rgba(0,255,0,0.2)\";\r\n    }\r\n  });\r\n\r\n  autogen.addEventListener(\"click\", () => {\r\n    auto = !auto;\r\n\r\n    updateStatus();\r\n\r\n    if (auto) {\r\n      autogen.style.border = \"2px solid rgba(0,225,0,0.5)\";\r\n      autogen.style.backgroundColor = \"rgba(0,225,0,0.2)\";\r\n    }\r\n\r\n    if (!auto) {\r\n      autogen.style.border = \"2px solid rgba(225,0,0,0.5)\";\r\n      autogen.style.backgroundColor = \"rgba(225,0,0,0.2)\";\r\n    }\r\n  });\r\n\r\n  reset.addEventListener(\"click\", () => {\r\n    console.clear();\r\n    console.log(\"starting new epoch\");\r\n\r\n    universe = wasm_game_of_life__WEBPACK_IMPORTED_MODULE_0__[\"Universe\"].new();\r\n    epoch += 1;\r\n    ALIVE_COLOR = getRandomColor();\r\n\r\n    toolbar.style.backgroundColor = hexToRgba(ALIVE_COLOR, 0.1);\r\n    running = true;\r\n    play.innerText = \"pause\";\r\n    renderLoop();\r\n  });\r\n\r\n  play.addEventListener(\"click\", () => {\r\n    console.log(process.env);\r\n    if (running) {\r\n      play.innerText = \"run\";\r\n    }\r\n\r\n    if (!running) {\r\n      play.innerText = \"pause\";\r\n    }\r\n\r\n    running = !running;\r\n    renderLoop();\r\n    updateStatus();\r\n  });\r\n\r\n  canvas.addEventListener(\"click\", (event) => {\r\n    const boundingRect = canvas.getBoundingClientRect();\r\n\r\n    const scaleX = canvas.width / boundingRect.width;\r\n    const scaleY = canvas.height / boundingRect.height;\r\n\r\n    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;\r\n    const canvasTop = (event.clientY - boundingRect.top) * scaleY;\r\n\r\n    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);\r\n    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);\r\n\r\n    universe.toggle_cell(row, col);\r\n    drawGrid();\r\n    drawCells();\r\n  });\r\n\r\n  toolbar.style.backgroundColor = hexToRgba(ALIVE_COLOR, 0.1);\r\n\r\n  updateStatus();\r\n  drawGrid();\r\n  drawCells();\r\n\r\n  if (wasmSupported) {\r\n    if (loader) loader.style.display = \"none\";\r\n  }\r\n\r\n  if (!wasmSupported) {\r\n    if (loader)\r\n      loader.innerText =\r\n        \"Webassembly not supported.\\nCheck if WASM JIT is enabled or change browser!\";\r\n  }\r\n  requestAnimationFrame(renderLoop);\r\n};\r\n\r\nsetTimeout(pageLoaded, 100);\r\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/process/browser.js */ \"./node_modules/process/browser.js\")))\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// shim for using process in browser\nvar process = module.exports = {};\n\n// cached from whatever global is present so that test runners that stub it\n// don't break things.  But we need to wrap it in a try catch in case it is\n// wrapped in strict mode code which doesn't define any globals.  It's inside a\n// function because try/catches deoptimize in certain engines.\n\nvar cachedSetTimeout;\nvar cachedClearTimeout;\n\nfunction defaultSetTimout() {\n    throw new Error('setTimeout has not been defined');\n}\nfunction defaultClearTimeout () {\n    throw new Error('clearTimeout has not been defined');\n}\n(function () {\n    try {\n        if (typeof setTimeout === 'function') {\n            cachedSetTimeout = setTimeout;\n        } else {\n            cachedSetTimeout = defaultSetTimout;\n        }\n    } catch (e) {\n        cachedSetTimeout = defaultSetTimout;\n    }\n    try {\n        if (typeof clearTimeout === 'function') {\n            cachedClearTimeout = clearTimeout;\n        } else {\n            cachedClearTimeout = defaultClearTimeout;\n        }\n    } catch (e) {\n        cachedClearTimeout = defaultClearTimeout;\n    }\n} ())\nfunction runTimeout(fun) {\n    if (cachedSetTimeout === setTimeout) {\n        //normal enviroments in sane situations\n        return setTimeout(fun, 0);\n    }\n    // if setTimeout wasn't available but was latter defined\n    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {\n        cachedSetTimeout = setTimeout;\n        return setTimeout(fun, 0);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedSetTimeout(fun, 0);\n    } catch(e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally\n            return cachedSetTimeout.call(null, fun, 0);\n        } catch(e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error\n            return cachedSetTimeout.call(this, fun, 0);\n        }\n    }\n\n\n}\nfunction runClearTimeout(marker) {\n    if (cachedClearTimeout === clearTimeout) {\n        //normal enviroments in sane situations\n        return clearTimeout(marker);\n    }\n    // if clearTimeout wasn't available but was latter defined\n    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {\n        cachedClearTimeout = clearTimeout;\n        return clearTimeout(marker);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedClearTimeout(marker);\n    } catch (e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally\n            return cachedClearTimeout.call(null, marker);\n        } catch (e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.\n            // Some versions of I.E. have different rules for clearTimeout vs setTimeout\n            return cachedClearTimeout.call(this, marker);\n        }\n    }\n\n\n\n}\nvar queue = [];\nvar draining = false;\nvar currentQueue;\nvar queueIndex = -1;\n\nfunction cleanUpNextTick() {\n    if (!draining || !currentQueue) {\n        return;\n    }\n    draining = false;\n    if (currentQueue.length) {\n        queue = currentQueue.concat(queue);\n    } else {\n        queueIndex = -1;\n    }\n    if (queue.length) {\n        drainQueue();\n    }\n}\n\nfunction drainQueue() {\n    if (draining) {\n        return;\n    }\n    var timeout = runTimeout(cleanUpNextTick);\n    draining = true;\n\n    var len = queue.length;\n    while(len) {\n        currentQueue = queue;\n        queue = [];\n        while (++queueIndex < len) {\n            if (currentQueue) {\n                currentQueue[queueIndex].run();\n            }\n        }\n        queueIndex = -1;\n        len = queue.length;\n    }\n    currentQueue = null;\n    draining = false;\n    runClearTimeout(timeout);\n}\n\nprocess.nextTick = function (fun) {\n    var args = new Array(arguments.length - 1);\n    if (arguments.length > 1) {\n        for (var i = 1; i < arguments.length; i++) {\n            args[i - 1] = arguments[i];\n        }\n    }\n    queue.push(new Item(fun, args));\n    if (queue.length === 1 && !draining) {\n        runTimeout(drainQueue);\n    }\n};\n\n// v8 likes predictible objects\nfunction Item(fun, array) {\n    this.fun = fun;\n    this.array = array;\n}\nItem.prototype.run = function () {\n    this.fun.apply(null, this.array);\n};\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\nprocess.version = ''; // empty string to avoid regexp issues\nprocess.versions = {};\n\nfunction noop() {}\n\nprocess.on = noop;\nprocess.addListener = noop;\nprocess.once = noop;\nprocess.off = noop;\nprocess.removeListener = noop;\nprocess.removeAllListeners = noop;\nprocess.emit = noop;\nprocess.prependListener = noop;\nprocess.prependOnceListener = noop;\n\nprocess.listeners = function (name) { return [] }\n\nprocess.binding = function (name) {\n    throw new Error('process.binding is not supported');\n};\n\nprocess.cwd = function () { return '/' };\nprocess.chdir = function (dir) {\n    throw new Error('process.chdir is not supported');\n};\nprocess.umask = function() { return 0; };\n\n\n//# sourceURL=webpack:///./node_modules/process/browser.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(originalModule) {\n\tif (!originalModule.webpackPolyfill) {\n\t\tvar module = Object.create(originalModule);\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"exports\", {\n\t\t\tenumerable: true\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack:///(webpack)/buildin/harmony-module.js?");

/***/ }),

/***/ "./pkg/wasm_game_of_life.js":
/*!**********************************!*\
  !*** ./pkg/wasm_game_of_life.js ***!
  \**********************************/
/*! exports provided: __wbg_set_wasm, greet, Universe, __wbindgen_object_drop_ref, __wbg_alert_d3b6e8db27c82dfa, __wbg_new_abda76e883ba8a5f, __wbg_stack_658279fe44541cf6, __wbg_error_f851667af71bcfc6, __wbg_random_26e2d782b541ca6b, __wbindgen_throw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wasm_game_of_life_bg.wasm */ \"./pkg/wasm_game_of_life_bg.wasm\");\n/* harmony import */ var _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wasm_game_of_life_bg.js */ \"./pkg/wasm_game_of_life_bg.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbg_set_wasm\", function() { return _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbg_set_wasm\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"greet\", function() { return _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"greet\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Universe\", function() { return _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"Universe\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_object_drop_ref\", function() { return _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbindgen_object_drop_ref\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbg_alert_d3b6e8db27c82dfa\", function() { return _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbg_alert_d3b6e8db27c82dfa\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbg_new_abda76e883ba8a5f\", function() { return _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbg_new_abda76e883ba8a5f\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbg_stack_658279fe44541cf6\", function() { return _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbg_stack_658279fe44541cf6\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbg_error_f851667af71bcfc6\", function() { return _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbg_error_f851667af71bcfc6\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbg_random_26e2d782b541ca6b\", function() { return _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbg_random_26e2d782b541ca6b\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_throw\", function() { return _wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbindgen_throw\"]; });\n\n\n\nObject(_wasm_game_of_life_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbg_set_wasm\"])(_wasm_game_of_life_bg_wasm__WEBPACK_IMPORTED_MODULE_0__);\n\n\n\n//# sourceURL=webpack:///./pkg/wasm_game_of_life.js?");

/***/ }),

/***/ "./pkg/wasm_game_of_life_bg.js":
/*!*************************************!*\
  !*** ./pkg/wasm_game_of_life_bg.js ***!
  \*************************************/
/*! exports provided: __wbg_set_wasm, greet, Universe, __wbindgen_object_drop_ref, __wbg_alert_d3b6e8db27c82dfa, __wbg_new_abda76e883ba8a5f, __wbg_stack_658279fe44541cf6, __wbg_error_f851667af71bcfc6, __wbg_random_26e2d782b541ca6b, __wbindgen_throw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbg_set_wasm\", function() { return __wbg_set_wasm; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"greet\", function() { return greet; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Universe\", function() { return Universe; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_object_drop_ref\", function() { return __wbindgen_object_drop_ref; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbg_alert_d3b6e8db27c82dfa\", function() { return __wbg_alert_d3b6e8db27c82dfa; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbg_new_abda76e883ba8a5f\", function() { return __wbg_new_abda76e883ba8a5f; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbg_stack_658279fe44541cf6\", function() { return __wbg_stack_658279fe44541cf6; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbg_error_f851667af71bcfc6\", function() { return __wbg_error_f851667af71bcfc6; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbg_random_26e2d782b541ca6b\", function() { return __wbg_random_26e2d782b541ca6b; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_throw\", function() { return __wbindgen_throw; });\nlet wasm;\nfunction __wbg_set_wasm(val) {\n    wasm = val;\n}\n\n\nconst heap = new Array(128).fill(undefined);\n\nheap.push(undefined, null, true, false);\n\nfunction getObject(idx) { return heap[idx]; }\n\nlet heap_next = heap.length;\n\nfunction dropObject(idx) {\n    if (idx < 132) return;\n    heap[idx] = heap_next;\n    heap_next = idx;\n}\n\nfunction takeObject(idx) {\n    const ret = getObject(idx);\n    dropObject(idx);\n    return ret;\n}\n\nconst lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;\n\nlet cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });\n\ncachedTextDecoder.decode();\n\nlet cachedUint8Memory0 = null;\n\nfunction getUint8Memory0() {\n    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {\n        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);\n    }\n    return cachedUint8Memory0;\n}\n\nfunction getStringFromWasm0(ptr, len) {\n    ptr = ptr >>> 0;\n    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));\n}\n\nlet WASM_VECTOR_LEN = 0;\n\nconst lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;\n\nlet cachedTextEncoder = new lTextEncoder('utf-8');\n\nconst encodeString = (typeof cachedTextEncoder.encodeInto === 'function'\n    ? function (arg, view) {\n    return cachedTextEncoder.encodeInto(arg, view);\n}\n    : function (arg, view) {\n    const buf = cachedTextEncoder.encode(arg);\n    view.set(buf);\n    return {\n        read: arg.length,\n        written: buf.length\n    };\n});\n\nfunction passStringToWasm0(arg, malloc, realloc) {\n\n    if (realloc === undefined) {\n        const buf = cachedTextEncoder.encode(arg);\n        const ptr = malloc(buf.length, 1) >>> 0;\n        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);\n        WASM_VECTOR_LEN = buf.length;\n        return ptr;\n    }\n\n    let len = arg.length;\n    let ptr = malloc(len, 1) >>> 0;\n\n    const mem = getUint8Memory0();\n\n    let offset = 0;\n\n    for (; offset < len; offset++) {\n        const code = arg.charCodeAt(offset);\n        if (code > 0x7F) break;\n        mem[ptr + offset] = code;\n    }\n\n    if (offset !== len) {\n        if (offset !== 0) {\n            arg = arg.slice(offset);\n        }\n        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;\n        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);\n        const ret = encodeString(arg, view);\n\n        offset += ret.written;\n        ptr = realloc(ptr, len, offset, 1) >>> 0;\n    }\n\n    WASM_VECTOR_LEN = offset;\n    return ptr;\n}\n/**\n* @param {string} msg\n* @param {string} name\n*/\nfunction greet(msg, name) {\n    const ptr0 = passStringToWasm0(msg, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n    const len0 = WASM_VECTOR_LEN;\n    const ptr1 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n    const len1 = WASM_VECTOR_LEN;\n    wasm.greet(ptr0, len0, ptr1, len1);\n}\n\nfunction addHeapObject(obj) {\n    if (heap_next === heap.length) heap.push(heap.length + 1);\n    const idx = heap_next;\n    heap_next = heap[idx];\n\n    heap[idx] = obj;\n    return idx;\n}\n\nlet cachedInt32Memory0 = null;\n\nfunction getInt32Memory0() {\n    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {\n        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);\n    }\n    return cachedInt32Memory0;\n}\n\nfunction notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }\n\nconst UniverseFinalization = (typeof FinalizationRegistry === 'undefined')\n    ? { register: () => {}, unregister: () => {} }\n    : new FinalizationRegistry(ptr => wasm.__wbg_universe_free(ptr >>> 0));\n/**\n*/\nclass Universe {\n\n    static __wrap(ptr) {\n        ptr = ptr >>> 0;\n        const obj = Object.create(Universe.prototype);\n        obj.__wbg_ptr = ptr;\n        UniverseFinalization.register(obj, obj.__wbg_ptr, obj);\n        return obj;\n    }\n\n    __destroy_into_raw() {\n        const ptr = this.__wbg_ptr;\n        this.__wbg_ptr = 0;\n        UniverseFinalization.unregister(this);\n        return ptr;\n    }\n\n    free() {\n        const ptr = this.__destroy_into_raw();\n        wasm.__wbg_universe_free(ptr);\n    }\n    /**\n    * @param {number} row\n    * @param {number} column\n    */\n    toggle_cell(row, column) {\n        wasm.universe_toggle_cell(this.__wbg_ptr, row, column);\n    }\n    /**\n    * Set the width of the universe.\n    * Resets all cells to the dead state.\n    * @param {number} width\n    */\n    set_width(width) {\n        wasm.universe_set_width(this.__wbg_ptr, width);\n    }\n    /**\n    * Set the height of the universe.\n    * Resets all cells to the dead state.\n    * @param {number} height\n    */\n    set_height(height) {\n        wasm.universe_set_height(this.__wbg_ptr, height);\n    }\n    /**\n    * @returns {boolean}\n    */\n    get_epoch() {\n        const ret = wasm.universe_get_epoch(this.__wbg_ptr);\n        return ret !== 0;\n    }\n    /**\n    * @returns {number}\n    */\n    width() {\n        const ret = wasm.universe_width(this.__wbg_ptr);\n        return ret >>> 0;\n    }\n    /**\n    * @returns {number}\n    */\n    height() {\n        const ret = wasm.universe_height(this.__wbg_ptr);\n        return ret >>> 0;\n    }\n    /**\n    * @returns {number}\n    */\n    cells_ptr() {\n        const ret = wasm.universe_cells_ptr(this.__wbg_ptr);\n        return ret >>> 0;\n    }\n    /**\n    * @returns {number}\n    */\n    get_gen() {\n        const ret = wasm.universe_get_gen(this.__wbg_ptr);\n        return ret >>> 0;\n    }\n    /**\n    * @returns {Universe}\n    */\n    static new() {\n        const ret = wasm.universe_new();\n        return Universe.__wrap(ret);\n    }\n    /**\n    */\n    tick() {\n        wasm.universe_tick(this.__wbg_ptr);\n    }\n}\n\nfunction __wbindgen_object_drop_ref(arg0) {\n    takeObject(arg0);\n};\n\nfunction __wbg_alert_d3b6e8db27c82dfa(arg0, arg1) {\n    alert(getStringFromWasm0(arg0, arg1));\n};\n\nfunction __wbg_new_abda76e883ba8a5f() {\n    const ret = new Error();\n    return addHeapObject(ret);\n};\n\nfunction __wbg_stack_658279fe44541cf6(arg0, arg1) {\n    const ret = getObject(arg1).stack;\n    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n    const len1 = WASM_VECTOR_LEN;\n    getInt32Memory0()[arg0 / 4 + 1] = len1;\n    getInt32Memory0()[arg0 / 4 + 0] = ptr1;\n};\n\nfunction __wbg_error_f851667af71bcfc6(arg0, arg1) {\n    let deferred0_0;\n    let deferred0_1;\n    try {\n        deferred0_0 = arg0;\n        deferred0_1 = arg1;\n        console.error(getStringFromWasm0(arg0, arg1));\n    } finally {\n        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);\n    }\n};\n\nconst __wbg_random_26e2d782b541ca6b = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');\n\nfunction __wbindgen_throw(arg0, arg1) {\n    throw new Error(getStringFromWasm0(arg0, arg1));\n};\n\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./pkg/wasm_game_of_life_bg.js?");

/***/ }),

/***/ "./pkg/wasm_game_of_life_bg.wasm":
/*!***************************************!*\
  !*** ./pkg/wasm_game_of_life_bg.wasm ***!
  \***************************************/
/*! exports provided: memory, greet, __wbg_universe_free, universe_toggle_cell, universe_set_width, universe_set_height, universe_get_epoch, universe_width, universe_height, universe_cells_ptr, universe_get_gen, universe_new, universe_tick, __wbindgen_malloc, __wbindgen_realloc, __wbindgen_free */
/***/ (function(module, exports, __webpack_require__) {

eval("\"use strict\";\n// Instantiate WebAssembly module\nvar wasmExports = __webpack_require__.w[module.i];\n__webpack_require__.r(exports);\n// export exports from WebAssembly module\nfor(var name in wasmExports) if(name != \"__webpack_init__\") exports[name] = wasmExports[name];\n// exec imports from WebAssembly module (for esm order)\n/* harmony import */ var m0 = __webpack_require__(/*! ./wasm_game_of_life_bg.js */ \"./pkg/wasm_game_of_life_bg.js\");\n\n\n// exec wasm module\nwasmExports[\"__webpack_init__\"]()\n\n//# sourceURL=webpack:///./pkg/wasm_game_of_life_bg.wasm?");

/***/ })

}]);