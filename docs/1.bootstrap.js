(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./stats.js":
/*!******************!*\
  !*** ./stats.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("javascript: (function () {\r\n  var script = document.createElement(\"script\");\r\n  let controls = document.querySelector(\"#controls\");\r\n  script.onload = function () {\r\n    var stats = new Stats();\r\n    stats.domElement.setAttribute(\"id\", \"stats\");\r\n    controls.appendChild(stats.dom);\r\n    requestAnimationFrame(function loop() {\r\n      stats.update();\r\n      requestAnimationFrame(loop);\r\n    });\r\n  };\r\n  script.src = \"https://mrdoob.github.io/stats.js/build/stats.min.js\";\r\n  controls.appendChild(script);\r\n})();\r\n\n\n//# sourceURL=webpack:///./stats.js?");

/***/ })

}]);