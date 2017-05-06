/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
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

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports);
	    global.canvas = mod.exports;
	  }
	})(this, function (exports) {
	  'use strict';
	
	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	
	  var _slicedToArray = function () {
	    function sliceIterator(arr, i) {
	      var _arr = [];
	      var _n = true;
	      var _d = false;
	      var _e = undefined;
	
	      try {
	        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	          _arr.push(_s.value);
	
	          if (i && _arr.length === i) break;
	        }
	      } catch (err) {
	        _d = true;
	        _e = err;
	      } finally {
	        try {
	          if (!_n && _i["return"]) _i["return"]();
	        } finally {
	          if (_d) throw _e;
	        }
	      }
	
	      return _arr;
	    }
	
	    return function (arr, i) {
	      if (Array.isArray(arr)) {
	        return arr;
	      } else if (Symbol.iterator in Object(arr)) {
	        return sliceIterator(arr, i);
	      } else {
	        throw new TypeError("Invalid attempt to destructure non-iterable instance");
	      }
	    };
	  }();
	
	  function _toConsumableArray(arr) {
	    if (Array.isArray(arr)) {
	      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	        arr2[i] = arr[i];
	      }
	
	      return arr2;
	    } else {
	      return Array.from(arr);
	    }
	  }
	
	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }
	
	  var _createClass = function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }
	
	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  }();
	
	  var Canvas = function () {
	    function Canvas() {
	      _classCallCheck(this, Canvas);
	
	      this.canvas = document.getElementById('canvas');
	      this.cxt = canvas.getContext('2d');
	      this.width = this.canvas.width = this.canvas.offsetWidth;
	      this.height = this.canvas.height = this.canvas.offsetHeight;
	      this.bounds = this.canvas.getBoundingClientRect();
	
	      this.ball_count = 20; // 总个数
	      this.line_range = 200; // 连线范围
	      this.r_range = [10, 20]; // 半径范围
	      this.color = [[0, 64, 121], [80, 5, 121]]; // 颜色[[r, g, b], ..]
	      this.period = 10; // 颜色呼吸周期
	      this.opacity = [0.3, 0.8]; // 透明度范围
	      this.speed = [-1, 1]; // 速度范围
	      this.mouse = {
	        x: 0,
	        y: 0,
	        r: 10,
	        color: [0, 0, 0]
	      };
	
	      this.vballs = [];
	      this.balls = [];
	
	      this.clickHandle = this.clickHandle.bind(this);
	      this.mouseHandle = this.mouseHandle.bind(this);
	      this.bindEvent();
	      this.start();
	    }
	    //  绑定事件
	
	
	    _createClass(Canvas, [{
	      key: 'bindEvent',
	      value: function bindEvent() {
	        this.canvas.addEventListener('click', this.clickHandle, false);
	        this.canvas.addEventListener('mousemove', this.mouseHandle, false);
	      }
	    }, {
	      key: 'unbindEvent',
	      value: function unbindEvent() {
	        this.canvas.removeEventListener('click', this.clickHandle, false);
	        this.canvas.removeEventListener('mousemove', this.mouseHandle, false);
	      }
	    }, {
	      key: 'clickHandle',
	      value: function clickHandle(e) {
	        if (this.isAnimate) {
	          return this.isAnimate = false;
	        } else {
	          this.start();
	        }
	      }
	    }, {
	      key: 'mouseHandle',
	      value: function mouseHandle(e) {
	        var mx = e.clientX - this.bounds.left;
	        var my = e.clientY - this.bounds.top;
	        this.mouse.x = mx;
	        this.mouse.y = my;
	      }
	    }, {
	      key: 'start',
	      value: function start() {
	        var _this = this;
	
	        if (this.isAnimate) {
	          return false;
	        }
	
	        for (var i = this.vballs.length; i < this.ball_count; i++) {
	          this.addBall();
	        }
	
	        this.isAnimate = true;
	
	        var step = function step() {
	          if (!_this.isAnimate) return false;
	          _this.render();
	          _this.update();
	          requestAnimationFrame(step);
	        };
	        requestAnimationFrame(step);
	      }
	    }, {
	      key: 'getColorList',
	      value: function getColorList(freq) {
	        var _this2 = this;
	
	        //  颜色差值[r, g, b]
	        var ColorDis = [this.color[1][0] - this.color[0][0], this.color[1][1] - this.color[0][1], this.color[1][2] - this.color[0][2]];
	
	        //  颜色差最大的绝对值
	        var ColorLength = Math.max(Math.abs(ColorDis[0]), Math.abs(ColorDis[1]), Math.abs(ColorDis[2])) * freq;
	
	        //  颜色变化系数
	        var ColorChange = ColorDis.map(function (c) {
	          return c / ColorLength;
	        });
	
	        var ColorList = [];
	
	        var _loop = function _loop(i) {
	          ColorList.push(ColorChange.map(function (c, index) {
	            return _this2.color[0][index] + c * i;
	          }));
	        };
	
	        for (var i = 0; i < ColorLength; i++) {
	          _loop(i);
	        }
	
	        return ColorList;
	      }
	    }, {
	      key: 'addBall',
	      value: function addBall() {
	        var ball = {
	          vx: this.getRandomNumber(this.speed),
	          vy: this.getRandomNumber(this.speed),
	          opacity: this.getRandomNumber(this.opacity),
	          freq: this.period,
	          type: ~~this.getRandomNumber([0, 3]),
	          cur_i: 0,
	          reverse: false
	        };
	
	        ball.r = (1 - ball.opacity) * (this.r_range[1] - this.r_range[0]) + this.r_range[0];
	        ball.x = this.getRandomNumber([ball.r, this.width - ball.r]);
	        ball.y = this.getRandomNumber([ball.r, this.height - ball.r]);
	
	        if (this.isOverlap(ball)) {
	          return this.addBall();
	        }
	
	        ball.color = this.color[0];
	        ball.ColorList = this.getColorList(ball.freq);
	
	        //  随机一种模式[0:实心球, 1:圆环, 2:双环]
	        switch (ball.type) {
	          case 0:
	            break;
	          case 1:
	            ball.empty = {
	              r: this.getRandomNumber([ball.r / 2, ball.r / 4 * 3])
	            };
	            break;
	          case 2:
	            ball.empty = {
	              r: this.getRandomNumber([ball.r / 2, ball.r / 4 * 3])
	            };
	            ball.son = {
	              r: this.getRandomNumber([ball.empty.r / 2, ball.empty.r / 4 * 3]),
	              color: [].concat(_toConsumableArray(ball.color))
	            };
	            break;
	        }
	
	        this.vballs.push(ball);
	      }
	    }, {
	      key: 'isOverlap',
	      value: function isOverlap(ball) {
	        return !this.vballs.every(function (b) {
	          var d = Math.sqrt(Math.pow(ball.x - b.x, 2) + Math.pow(ball.y - b.y, 2));
	          if (d <= ball.r + b.r) {
	            return false;
	          }
	          return true;
	        });
	      }
	    }, {
	      key: 'addMirrorBall',
	      value: function addMirrorBall(ball, obj) {
	        var newBall = {};
	        for (var key in ball) {
	          if (obj[key] !== undefined) {
	            newBall[key] = obj[key];
	          } else {
	            newBall[key] = ball[key];
	          }
	        }
	
	        return newBall;
	      }
	    }, {
	      key: 'getBalls',
	      value: function getBalls() {
	        var ball = null,
	            balls = [];
	
	        // balls.push(this.mouse)
	
	        for (var i = 0, len = this.vballs.length; i < len; i++) {
	          ball = this.vballs[i];
	          balls = balls.concat([ball, this.addMirrorBall(ball, { x: ball.x + this.width, parent: ball }), this.addMirrorBall(ball, { x: ball.x - this.width, parent: ball }), this.addMirrorBall(ball, { y: ball.y + this.height, parent: ball }), this.addMirrorBall(ball, { y: ball.y - this.height, parent: ball }), this.addMirrorBall(ball, { x: ball.x + this.width, y: ball.y + this.height, parent: ball }), this.addMirrorBall(ball, { x: ball.x - this.width, y: ball.y - this.height, parent: ball }), this.addMirrorBall(ball, { y: ball.y + this.height, x: ball.x - this.width, parent: ball }), this.addMirrorBall(ball, { y: ball.y - this.height, x: ball.x + this.width, parent: ball })]);
	        }
	
	        return balls;
	      }
	    }, {
	      key: 'render',
	      value: function render(progress) {
	        var _this3 = this;
	
	        this.cxt.clearRect(0, 0, this.width, this.height);
	
	        this.balls.length = 0;
	        this.balls = this.getBalls();
	
	        Array.from(this.balls, function (ball) {
	          _this3.renderBall(ball);
	        });
	      }
	    }, {
	      key: 'renderBall',
	      value: function renderBall(ball) {
	        var _this4 = this;
	
	        var x = ball.x,
	            y = ball.y;
	
	        //  大球体
	        this.renderArc(x, y, ball.r, this.getRGBA(ball.color, ball.opacity));
	
	        //  type:1|2 空心白色部分
	        this.cxt.globalCompositeOperation = 'destination-out';
	        ball.type > 0 && this.renderArc(x, y, ball.empty.r, '#fff');
	
	        //  type:2 球心部分
	        this.cxt.globalCompositeOperation = 'source-over';
	        ball.type === 2 && this.renderArc(x, y, ball.son.r, this.getRGBA(ball.son.color, ball.opacity));
	
	        //  连线
	        Array.from(this.balls, function (b) {
	          if (ball === b) {
	            return false;
	          }
	
	          var d = Math.sqrt(Math.pow(x - b.x, 2) + Math.pow(y - b.y, 2));
	          if (d < _this4.line_range && d > ball.r + b.r) {
	            var g = _this4.cxt.createLinearGradient(x, y, b.x, b.y);
	            if (ball.type === 1) {
	              g.addColorStop(0, _this4.getRGBA(ball.color, d / _this4.line_range));
	              g.addColorStop(ball.empty.r / d, _this4.getRGBA(ball.color, d / _this4.line_range));
	              g.addColorStop(ball.empty.r / d, 'transparent');
	            } else if (ball.type === 2) {
	              g.addColorStop(0, 'transparent');
	              g.addColorStop(ball.son.r / d, 'transparent');
	              g.addColorStop(ball.son.r / d, _this4.getRGBA(ball.color, d / _this4.line_range));
	              g.addColorStop(ball.empty.r / d, _this4.getRGBA(ball.color, d / _this4.line_range));
	              g.addColorStop(ball.empty.r / d, 'transparent');
	            } else {
	              g.addColorStop(0, 'transparent');
	            }
	            g.addColorStop(ball.r / d, 'transparent');
	            g.addColorStop(ball.r / d, _this4.getRGBA(ball.color, 1 - d / _this4.line_range));
	            g.addColorStop(1 - b.r / d, _this4.getRGBA(b.color, 1 - d / _this4.line_range));
	            g.addColorStop(1 - b.r / d, 'transparent');
	            g.addColorStop(1, 'transparent');
	            _this4.cxt.strokeStyle = g;
	            _this4.renderLine(x, y, b.x, b.y);
	          } else if (d < ball.r + b.r && !b.isCrash && !ball.isCrash) {
	            ball.isCrash = true;
	            b.isCrash = true;
	            _this4.crashHandle(ball, b);
	
	            if (ball.parent) {
	              ball.parent.isCrash = true;
	            }
	
	            if (b.parent) {
	              b.parent.isCrash = true;
	            }
	          }
	        });
	      }
	    }, {
	      key: 'crashHandle',
	      value: function crashHandle(b1, b2) {
	        var deg = Math.atan2(b2.y - b1.y, b2.x - b1.x);
	        var speed1 = Math.sqrt(b1.vx * b1.vx + b1.vy * b1.vy);
	        var speed2 = Math.sqrt(b2.vx * b2.vx + b2.vy * b2.vy);
	        var dir1 = Math.atan2(b1.vy, b1.vx);
	        var dir2 = Math.atan2(b2.vy, b2.vx);
	
	        var vx1 = speed1 * Math.cos(dir1 - deg);
	        var vy1 = speed1 * Math.sin(dir1 - deg);
	        var vx2 = speed2 * Math.cos(dir2 - deg);
	        var vy2 = speed2 * Math.sin(dir2 - deg);
	
	        var fx1 = vx2;
	        var fy1 = vy1;
	        var fx2 = vx1;
	        var fy2 = vy2;
	
	        b1.fx = Math.cos(deg) * fx1 + Math.cos(deg + Math.PI / 2) * fy1;
	        b1.fy = Math.sin(deg) * fx1 + Math.sin(deg + Math.PI / 2) * fy1;
	        b2.fx = Math.cos(deg) * fx2 + Math.cos(deg + Math.PI / 2) * fy2;
	        b2.fy = Math.sin(deg) * fx2 + Math.sin(deg + Math.PI / 2) * fy2;
	      }
	    }, {
	      key: 'update',
	      value: function update() {
	        var _this5 = this;
	
	        this.vballs = this.vballs.map(function (ball) {
	          if (ball.x < -ball.r) {
	            ball.x = ball.x + _this5.width;
	          } else if (ball.x > _this5.width + ball.r) {
	            ball.x = ball.x - _this5.width;
	          } else if (ball.y < -ball.r) {
	            ball.y = ball.y + _this5.height;
	          } else if (ball.y > _this5.height + ball.r) {
	            ball.y = ball.y - _this5.height;
	          }
	          _this5.updateColor(ball);
	
	          if (ball.isCrash) {
	            ball.isCrash = false;
	
	            ball.vx = ball.fx;
	            ball.vy = ball.fy;
	          }
	
	          ball.x += ball.vx;
	          ball.y += ball.vy;
	
	          return ball;
	        });
	      }
	    }, {
	      key: 'updateColor',
	      value: function updateColor(ball) {
	        ball.color = ball.color.map(function (n, i) {
	          ball.cur_i++;
	          if (ball.cur_i === ball.ColorList.length) {
	            ball.cur_i = 0;
	            ball.reverse = !ball.reverse;
	          }
	          return ball.ColorList[ball.reverse ? ball.ColorList.length - ball.cur_i - 1 : ball.cur_i][i];
	        });
	
	        if (ball.type === 2) {
	          ball.son.color = [].concat(_toConsumableArray(ball.color));
	        }
	      }
	    }, {
	      key: 'getRGBA',
	      value: function getRGBA(color, opacity) {
	        return color === 'transparent' ? color : 'rgba(' + ~~color[0] + ', ' + ~~color[1] + ', ' + ~~color[2] + ', ' + opacity + ')';
	      }
	    }, {
	      key: 'getRandomNumber',
	      value: function getRandomNumber(_ref, decimal) {
	        var _ref2 = _slicedToArray(_ref, 2),
	            min = _ref2[0],
	            max = _ref2[1];
	
	        return Math.random() * (max - min) + min;
	      }
	    }, {
	      key: 'renderArc',
	      value: function renderArc(x, y, r, color) {
	        this.cxt.fillStyle = color;
	
	        this.cxt.beginPath();
	        this.cxt.arc(x, y, r, 0, Math.PI * 2, true);
	        this.cxt.closePath();
	
	        this.cxt.fill();
	      }
	    }, {
	      key: 'renderLine',
	      value: function renderLine(x1, y1, x2, y2) {
	        this.cxt.beginPath();
	        this.cxt.moveTo(x1, y1);
	        this.cxt.lineTo(x2, y2);
	        this.cxt.closePath();
	
	        this.cxt.stroke();
	      }
	    }, {
	      key: 'renderTri',
	      value: function renderTri(coord1, coord2, coord3) {
	        this.cxt.beginPath();
	        this.cxt.moveTo(coord1.x, coord1.y);
	        this.cxt.lineTo(coord2.x, coord2.y);
	        this.cxt.lineTo(coord3.x, coord3.y);
	        this.cxt.lineTo(coord1.x, coord1.y);
	        this.cxt.closePath();
	
	        this.cxt.stroke();
	      }
	    }]);
	
	    return Canvas;
	  }();
	
	  exports.default = Canvas;
	});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(require('./canvas.js'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(global.canvas);
	    global.index = mod.exports;
	  }
	})(this, function (_canvas) {
	  'use strict';
	
	  var _canvas2 = _interopRequireDefault(_canvas);
	
	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }
	
	  new _canvas2.default();
	});

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map