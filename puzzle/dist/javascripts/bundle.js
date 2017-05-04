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

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(e,n){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (n), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if("undefined"!=typeof exports)n(exports);else{var t={exports:{}};n(t.exports),e.cat=t.exports}}(this,function(e){"use strict";function n(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var t=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),r=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"NightCat";n(this,e),this.name=t}return t(e,[{key:"getName",value:function(){return this.name}}]),e}();e.default=r});
	//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhdC5qcyJdLCJuYW1lcyI6WyJDYXQiLCJuYW1lIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiX2NsYXNzQ2FsbENoZWNrIiwidGhpcyJdLCJtYXBwaW5ncyI6IjBsQkFBcUJBLGFBQ3BCLFFBQUFBLEtBQThCLEdBQWxCQyxHQUFrQkMsVUFBQUMsT0FBQSxPQUFBQyxLQUFBRixVQUFBLEdBQUFBLFVBQUEsR0FBWCxVQUFXRyxHQUFBQyxLQUFBTixHQUM3Qk0sS0FBS0wsS0FBT0EsOENBR1osTUFBT0ssTUFBS0wsd0JBTE9EIiwiZmlsZSI6ImNhdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIENhdCB7XHJcblx0Y29uc3RydWN0b3IobmFtZSA9ICdOaWdodENhdCcpe1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHR9XHJcblx0Z2V0TmFtZSAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5uYW1lO1xyXG5cdH1cclxufTsiXX0=


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(e,t){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (t), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if("undefined"!=typeof exports)t(require("./cat.js"));else{var i={exports:{}};t(e.cat),e.index=i.exports}}(this,function(e){"use strict";var t=(function(e){e&&e.__esModule}(e),document.querySelector(".grid"));t.querySelectorAll(".grid-item");t.addEventListener("click",function(e){if(!e.target.classList.contains("grid-item"))return!1;window.getComputedStyle(e.target)["grid-area"].slice(0,5);console.log(void 0)})});
	//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImdyaWQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJ0YXJnZXQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsIndpbmRvdyIsImdldENvbXB1dGVkU3R5bGUiLCJzbGljZSIsImNvbnNvbGUiLCJsb2ciLCJ1bmRlZmluZWQiXSwibWFwcGluZ3MiOiJnT0FVSUEsb0NBQU9DLFNBQVNDLGNBQWMsU0FDdEJGLEdBQUtHLGlCQUFpQixhQUVsQ0gsR0FBS0ksaUJBQWlCLFFBQVMsU0FBQ0MsR0FFOUIsSUFEV0EsRUFBRUMsT0FDSEMsVUFBVUMsU0FBUyxhQUMzQixPQUFPLENBRUVDLFFBQU9DLGlCQUFpQkwsRUFBRUMsUUFBUSxhQUFhSyxNQUFNLEVBQUcsRUFDbkVDLFNBQVFDLFFBQVJDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENhdCBmcm9tICcuL2NhdC5qcydcclxuXHJcbmxldCBlbXB0eSA9IFsxLCAxXVxyXG5cclxubGV0IGFyciA9IFtcclxuICAgICAgICAgIFsnaXRlbTEnLCAnaXRlbTInLCAnaXRlbTMnXSxcclxuICAgICAgICAgIFsnaXRlbTQnLCAnLiAgICAnLCAnaXRlbTUnXSxcclxuICAgICAgICAgIFsnaXRlbTYnLCAnaXRlbTcnLCAnaXRlbTgnXVxyXG4gICAgICAgICAgXVxyXG5cclxubGV0IGdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZCcpXHJcbmxldCBpdGVtcyA9IGdyaWQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtaXRlbScpXHJcblxyXG5ncmlkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICBsZXQgaXRlbSA9IGUudGFyZ2V0XHJcbiAgaWYgKCFpdGVtLmNsYXNzTGlzdC5jb250YWlucygnZ3JpZC1pdGVtJykpXHJcbiAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgbGV0IG5hbWUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlLnRhcmdldClbJ2dyaWQtYXJlYSddLnNsaWNlKDAsIDUpXHJcbiAgY29uc29sZS5sb2codGhpcylcclxufSlcclxuXHJcbmZ1bmN0aW9uIHNldEdyaWQgKCkge1xyXG4gIGdyaWQuc3R5bGUuZ3JpZFRlbXBsYXRlQXJlYXMgPSBBcnJheS5mcm9tKGFyciwgbGluZSA9PiBgXCIke2xpbmUuam9pbignICcpfVwiYCkuam9pbignXFxuJylcclxufVxyXG5cclxuLy8gc2V0R3JpZCgpXHJcblxyXG4iXX0=


/***/ })
/******/ ]);