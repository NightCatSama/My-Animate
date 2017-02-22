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
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(3);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(t,i){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports,__webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (i), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if("undefined"!=typeof exports)i(exports,require("./rhythm"));else{var e={exports:{}};i(e.exports,t.rhythm),t.index=e.exports}}(this,function(t,i){"use strict";function e(t){return t&&t.__esModule?t:{"default":t}}function h(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var s=e(i),r=function(){function t(t,i){for(var e=0;e<i.length;e++){var h=i[e];h.enumerable=h.enumerable||!1,h.configurable=!0,"value"in h&&(h.writable=!0),Object.defineProperty(t,h.key,h)}}return function(i,e,h){return e&&t(i.prototype,e),h&&t(i,h),i}}(),a={text:"NightCat",musics:[{name:"Maroon 5 - Sugar",src:"./src/music/Maroon 5 - Sugar.mp3"},{name:"TheFatRat - Jackpot",src:"./src/music/TheFatRat - Jackpot.mp3"},{name:"Axol x Alex Skrindo - You",src:"./src/music/Axol x Alex Skrindo - You.mp3"},{name:"IMLAY MYLK - Flower Flower",src:"./src/music/IMLAY MYLK - Flower Flower.mp3"}],size:30,color:"#fff",offset:1,gridX:1,gridY:1,r:1},n=function l(t,i,e,s,r){h(this,l),t=t+Math.random()*r-.5*r,i=i+Math.random()*r-.5*r,this.x=this.cx=t,this.y=this.cy=i,this.r=e,this.rhythm=null,this.color=s,this.size=200},c=function u(t){h(this,u),this.character=t,this.width=0,this.size=200,this.offset=10,this.particles=[]},o=function(){function t(i,e){h(this,t),Object.assign(this,a,e),this.canvas=document.getElementById(i),this.cxt=this.canvas.getContext("2d"),this.placement=[],this.array=[],this.length=0,this.index=0,this.isAnimate=!1,this.init()}return r(t,[{key:"changeSong",value:function(t){this.index="number"==typeof t?t:this.index+1,this.index>this.musics.length-1&&(this.index=0),this.rhythm&&this.rhythm.pause(),this.rhythm=null,this.rhythm=new s["default"](this.musics[this.index].src),this.text=this.musics[this.index].name,this.setText(),this.rhythm.play()}},{key:"init",value:function(){this.getSize(),this.changeSong(0),this.setText(),this.start()}},{key:"getSize",value:function(){this.width=this.canvas.width=this.canvas.offsetWidth,this.height=this.canvas.height=this.canvas.offsetHeight}},{key:"destory",value:function(){this.cxt.clearRect(0,0,this.width,this.height),this.placement.length=0,this.stop()}},{key:"setText",value:function(){var t=this;this.placement.length=0,Array.from(this.text,function(i){var e=new c(i),h=t.getPartical(i);e.particles=h.particles,e.width=h.width,t.placement.push(e)}),this.length=0,Array.from(this.placement,function(i){t.length+=~~i.width})}},{key:"getPartical",value:function(t){this.cxt.textAlign="center",this.cxt.font="normal "+this.size+"px arial",this.cxt.fillStyle=this.color,this.cxt.fillText(t,this.x||this.width/2,this.y||this.height/2+50);for(var i=this.cxt.measureText(t).width,e=this.cxt.getImageData(0,0,this.width,this.height),h=new Uint32Array(e.data.buffer),s=[],r=0;r<this.height;r+=this.gridY)for(var a=0;a<this.width;a+=this.gridX)if(h[r*this.width+a]){var c=new n(a,r,this.r,this.color,this.offset);s.push(c)}return this.cxt.clearRect(0,0,this.width,this.height),{width:i,particles:s}}},{key:"start",value:function(){var t=this;this.isAnimate=!0,this.rhythm.play(),this.cxt.shadowColor="#fff",this.cxt.shadowBlur=3;var i=function e(){return!!t.isAnimate&&(t.rhythm.audio.ended&&t.changeSong(),t.render(),t.renderFrequency(),t.update(),void requestAnimationFrame(e))};requestAnimationFrame(i)}},{key:"toggle",value:function(){this.isAnimate?this.stop():this.start()}},{key:"stop",value:function(){this.isAnimate=!1,this.cxt.clearRect(0,0,this.width,this.height),this.rhythm.pause()}},{key:"render",value:function(){var t=this;this.cxt.clearRect(0,0,this.width,this.height);var i=this.length*-.5;Array.from(this.placement,function(e){var h=~~e.width,s=(e.particles.length,void 0),r=void 0;t.cxt.strokeStyle=t.color,t.cxt.lineWidth=.5,Array.from(e.particles,function(e,a){var n=e.x+i+.5*h,c=e.y;t.cxt.fillStyle=t.color,t.cxt.beginPath(),t.cxt.arc(e.x+i+.5*h,e.y,e.r,0,2*Math.PI,!0),t.cxt.closePath(),t.cxt.fill(),s=n,r=c}),i+=h})}},{key:"renderFrequency",value:function(){this.array=this.rhythm.getArr(),this.array=this.array.slice(0,Math.round(2/3*this.array.length));for(var t=450,i=this.width/2-t/2,e=this.height/2-this.size/2,h=2,s=this.array.length,r=t/s-h,a=Math.round(this.array.length/s),n=50,c=i-120,o=i+t+120,l=this.height-e-30,u=0;u<s;u++){var f=this.array[u*a]/255*this.array[u*a]*Math.sin(Math.PI/90*(90/s*u))/4+2;this.cxt.fillRect(u*(h+r)+i,this.height-f-e,r,f),f=-f,this.cxt.fillRect(u*(h+r)+i,this.height-f-e+1.5*this.size,r,f),u%2?(this.cxt.save(),this.cxt.translate(c,l+n),this.cxt.rotate(Math.PI/180*(180/s*u-180)),this.cxt.translate(-c,-l+n),this.cxt.fillRect(c,l-f,r,f),this.cxt.restore()):(this.cxt.save(),this.cxt.translate(c,l+n),this.cxt.rotate(Math.PI/180*(180/s*u)),this.cxt.translate(-c,-l+n),this.cxt.fillRect(c,l-f,r,f),this.cxt.restore()),u%2?(this.cxt.save(),this.cxt.translate(o,l+n),this.cxt.rotate(Math.PI/180*(180/s*u-180)),this.cxt.translate(-o,-l+n),this.cxt.fillRect(o,l-f,r,f),this.cxt.restore()):(this.cxt.save(),this.cxt.translate(o,l+n),this.cxt.rotate(Math.PI/180*(180/s*u)),this.cxt.translate(-o,-l+n),this.cxt.fillRect(o,l-f,r,f),this.cxt.restore())}}},{key:"update",value:function(){for(var t=this.array.length,i=Math.round(this.array.length/t),e=0,h=0;h<t;h++)e+=this.array[h*i];var s=e/t;Array.from(this.placement,function(t){Array.from(t.particles,function(t){t.x=s/100*2-2+t.cx,t.y=s/100*2-2+t.cy,t.r=s/100*.5})})}}]),t}();t["default"]=o});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(e,t){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (t), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if("undefined"!=typeof exports)t(exports);else{var n={exports:{}};t(n.exports),e.rhythm=n.exports}}(this,function(e){"use strict";function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),i=function(){function e(n){t(this,e),this.isAnimate=!1,this.audio=document.createElement("audio"),this.audio.src=n,this.cxt=this.getAudioContext(),this.analyser=this.cxt.createAnalyser(),this.analyser.minDecibels=-90,this.analyser.maxDecibels=-10,this.analyser.fftSize=256,this.cxt.createMediaElementSource(this.audio).connect(this.analyser),this.analyser.connect(this.cxt.destination),this.canvas=document.getElementById("canvas"),this.canvasCXT=this.canvas.getContext("2d"),this.canvas.width=this.canvas.offsetWidth,this.canvas.height=this.canvas.offsetHeight}return n(e,[{key:"getAudioContext",value:function(){var e=window.AudioContext||window.webkitAudioContext||window.mozAudioContext;return new e}},{key:"play",value:function(){this.audio.play()}},{key:"pause",value:function(){this.audio.pause()}},{key:"getArr",value:function(){var e=new Uint8Array(this.analyser.frequencyBinCount);return this.analyser.getByteFrequencyData(e),e}}]),e}();e["default"]=i});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(e,n){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (n), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if("undefined"!=typeof exports)n(require("./index.js"));else{var i={exports:{}};n(e.index),e.main=i.exports}}(this,function(e){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}var i=n(e);new i["default"]("canvas")});

/***/ }
/******/ ]);