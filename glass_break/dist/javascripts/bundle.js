/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(t,e){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (e), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if("undefined"!=typeof exports)e(exports);else{var n={exports:{}};e(n.exports),t.canvas=n.exports}}(this,function(t){"use strict";function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function t(t,e){var n=[],i=!0,r=!1,a=void 0;try{for(var s,o=t[Symbol.iterator]();!(i=(s=o.next()).done)&&(n.push(s.value),!e||n.length!==e);i=!0);}catch(t){r=!0,a=t}finally{try{!i&&o.return&&o.return()}finally{if(r)throw a}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),r=function(){function t(){e(this,t),this.canvas=document.getElementById("canvas"),this.cxt=canvas.getContext("2d"),this.width=this.canvas.width=this.canvas.offsetWidth,this.height=this.canvas.height=this.canvas.offsetHeight,this.bounds=this.canvas.getBoundingClientRect(),this.clickHandle=this.clickHandle.bind(this),this.bindEvent()}return i(t,[{key:"bindEvent",value:function(){this.canvas.addEventListener("click",this.clickHandle,!1)}},{key:"unbindEvent",value:function(){this.canvas.removeEventListener("click",this.clickHandle,!1)}},{key:"clickHandle",value:function(t){var e=t.clientX-this.bounds.left,n=t.clientY-this.bounds.top;this.render({x:e,y:n})}},{key:"render",value:function(t){var e=[100,300],n=0;this.cxt.strokeStyle="#fff";for(var i=0;i<20;i++){var r=[n,n+18];n+=18;var a=this.getRandomDot(e,r,t),s=this.getRandomDot(e,r,t);this.renderTri(t,a,s),this.renderLine(t,a),this.renderLine(t,s)}}},{key:"getRandomNumber",value:function(t){var e=n(t,2),i=e[0],r=e[1];return~~(Math.random()*(r-i))+i}},{key:"getRandomDot",value:function(t,e,n){var i=n.x,r=n.y,a=Math.PI/180*this.getRandomNumber(e),s=this.getRandomNumber(t);return{x:i+s*Math.cos(a),y:r+s*Math.sin(a),e_x:i+this.width*Math.cos(a),e_y:r+this.width*Math.sin(a)}}},{key:"renderDot",value:function(t,e){this.cxt.beginPath(),this.cxt.arc(t,e,1,0,2*Math.PI,!0),this.cxt.closePath(),this.cxt.fill()}},{key:"renderLine",value:function(t,e){this.cxt.lineWidth=.1*this.getRandomNumber([3,10]),this.cxt.beginPath(),this.cxt.moveTo(t.x,t.y),this.cxt.lineTo(e.e_x,e.e_y),this.cxt.closePath(),this.cxt.stroke()}},{key:"renderTri",value:function(t,e,n){this.cxt.moveTo(t.x,t.y),this.cxt.lineTo(e.x,e.y),this.cxt.lineTo(n.x,n.y),this.cxt.lineTo(t.x,t.y),this.cxt.stroke()}}]),t}();t.default=r});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(e,n){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (n), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if("undefined"!=typeof exports)n(require("./canvas.js"));else{var t={exports:{}};n(e.canvas),e.index=t.exports}}(this,function(e){"use strict";new(function(e){return e&&e.__esModule?e:{default:e}}(e).default)});

/***/ })
/******/ ]);