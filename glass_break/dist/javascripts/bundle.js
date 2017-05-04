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

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(t,e){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (e), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if("undefined"!=typeof exports)e(exports);else{var i={exports:{}};e(i.exports),t.canvas=i.exports}}(this,function(t){"use strict";function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function t(t,e){var i=[],n=!0,r=!1,o=void 0;try{for(var s,a=t[Symbol.iterator]();!(n=(s=a.next()).done)&&(i.push(s.value),!e||i.length!==e);n=!0);}catch(t){r=!0,o=t}finally{try{!n&&a.return&&a.return()}finally{if(r)throw o}}return i}return function(e,i){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),r=function(){function t(){e(this,t),this.canvas=document.getElementById("canvas"),this.cxt=canvas.getContext("2d"),this.width=this.canvas.width=this.canvas.offsetWidth,this.height=this.canvas.height=this.canvas.offsetHeight,this.bounds=this.canvas.getBoundingClientRect(),this.T=1e4,this.works=[],this.clickHandle=this.clickHandle.bind(this),this.bindEvent()}return n(t,[{key:"bindEvent",value:function(){this.canvas.addEventListener("click",this.clickHandle,!1)}},{key:"unbindEvent",value:function(){this.canvas.removeEventListener("click",this.clickHandle,!1)}},{key:"clickHandle",value:function(t){var e=t.clientX-this.bounds.left,i=t.clientY-this.bounds.top;this.addWork({x:e,y:i})}},{key:"start",value:function(){return this.render()}},{key:"addWork",value:function(t){var e=[100,400],i=200;this.createWork(t,e,i),e=[500,1e3],i=100,this.createWork(t,e,i),e=[1e3,3e3],i=50,this.createWork(t,e,i),this.start()}},{key:"createWork",value:function(t,e,i){for(var n=0,r=360/i,o={origin_coord:t,dots:[]},s=0;s<i;s++){var a=[n,n+r];n+=r;var c=this.getRandomDot(e,a,t),h=this.getRandomDot(e,a,t);if(c.deg>h.deg){var u=c;c=h,h=u}o.dots.push({coord1:c,coord2:h}),0===s&&(o.firstDot=c)}this.works.push(o)}},{key:"render",value:function(t){var e=this;this.cxt.clearRect(0,0,this.width,this.height),this.cxt.strokeStyle="#fff",this.cxt.lineWidth=.5,Array.from(this.works,function(i){var n=i.origin_coord;i.firstDot;Array.from(i.dots,function(i,r){var o=i.coord1,s=i.coord2,a=e.getPos(o,t),c=e.getPos(s,t);e.renderTri(n,{x:a.x1,y:a.y1},{x:c.x1,y:c.y1}),e.renderTri(n,{x:a.x2,y:a.y2},{x:c.x2,y:c.y2})})})}},{key:"getPos",value:function(t,e){var i=e?e/this.T:1;return{x1:(t.x1-t.x)*i+t.x,y1:(t.y1-t.y)*i+t.y,x2:(t.x2-t.x)*i+t.x,y2:(t.y2-t.y)*i+t.y}}},{key:"getRandomNumber",value:function(t){var e=i(t,2),n=e[0],r=e[1];return~~(Math.random()*(r-n))+n}},{key:"getRandomDot",value:function(t,e,i){var n=i.x,r=i.y,o=this.getRandomNumber(e),s=Math.PI/180*o,a=this.getRandomNumber(t),c=this.getRandomNumber(t);return{deg:o,x:n,y:r,x1:n+a*Math.cos(s),y1:r+a*Math.sin(s),x2:n+c*Math.cos(s),y2:r+c*Math.sin(s),e_x:n+this.width*Math.cos(s),e_y:r+this.width*Math.sin(s)}}},{key:"renderDot",value:function(t,e){this.cxt.beginPath(),this.cxt.arc(t,e,1,0,2*Math.PI,!0),this.cxt.closePath(),this.cxt.fill()}},{key:"renderLine",value:function(t,e,i,n){this.cxt.beginPath(),this.cxt.moveTo(t,e),this.cxt.lineTo(i,n),this.cxt.closePath(),this.cxt.stroke()}},{key:"renderTri",value:function(t,e,i){this.cxt.beginPath(),this.cxt.moveTo(t.x,t.y),this.cxt.lineTo(e.x,e.y),this.cxt.lineTo(i.x,i.y),this.cxt.lineTo(t.x,t.y),this.cxt.closePath(),this.cxt.stroke()}}]),t}();t.default=r});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(e,n){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (n), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if("undefined"!=typeof exports)n(require("./canvas.js"));else{var t={exports:{}};n(e.canvas),e.index=t.exports}}(this,function(e){"use strict";new(function(e){return e&&e.__esModule?e:{default:e}}(e).default)});

/***/ })
/******/ ]);