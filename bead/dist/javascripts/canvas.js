(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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

  var _defaultColors = [[240, 91, 114, 3000], [49, 105, 146, 3000], [153, 47, 37, 3000], [120, 115, 201, 3000], [153, 105, 33, 3000], [70, 120, 33, 3000], [28, 110, 110, 3000], [75, 75, 120]];

  var _default = {
    txt: 'NightCat', // 文本
    font: 'normal 100px sans-serif', // 文本样式
    ball_count: 30, // 总个数
    line_range: 200, // 连线范围
    r_range: [10, 20], // 半径范围
    color: _defaultColors, // 小球颜色组 [[r, g, b, time]...] *time: 在该颜色停留的时间
    bgColor: [[224, 224, 224, 20000], [22, 22, 22, 20000]], // 背景颜色组
    textColor: [[52, 52, 52, 20000], [224, 224, 224, 20000]], // 文本颜色组
    mouseColor: _defaultColors, // 鼠标颜色组
    period: 5000, // 颜色呼吸周期
    bgPeriod: 5000, // 背景颜色呼吸周期
    textPeriod: 5000, // 文本颜色呼吸周期
    opacity: [0.3, 0.8], // 透明度范围
    speed: [-1, 1], // 速度范围
    clickPause: false // 是否点击暂停
  };

  var Canvas = function () {
    function Canvas(id, option) {
      _classCallCheck(this, Canvas);

      this.canvas = document.getElementById(id);
      this.cxt = this.canvas.getContext('2d');

      Object.assign(this, _default, option);

      this.mouse = {
        x: 0,
        y: 0,
        r: 0,
        type: -1,
        catchBall: false,
        onLine: false
      };

      Object.assign(this.mouse, this.initGradientData(this.period, this.mouseColor));

      this.vballs = [];
      this.balls = [];
      this.bg = this.initGradientData(this.bgPeriod, this.bgColor);
      this.text = this.initGradientData(this.textPeriod, this.textColor);

      this.clickHandle = this.clickHandle.bind(this);
      this.mouseHandle = this.mouseHandle.bind(this);
      this.init = this.init.bind(this);
      this.bindEvent();
      this.init();
      this.start();
    }
    //  初始化canvas


    _createClass(Canvas, [{
      key: 'init',
      value: function init() {
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        this.bounds = this.canvas.getBoundingClientRect();
      }
    }, {
      key: 'bindEvent',
      value: function bindEvent() {
        this.canvas.addEventListener('click', this.clickHandle, false);
        this.canvas.addEventListener('mousemove', this.mouseHandle, false);
        window.addEventListener('resize', this.init, false);
      }
    }, {
      key: 'unbindEvent',
      value: function unbindEvent() {
        this.canvas.removeEventListener('click', this.clickHandle, false);
        this.canvas.removeEventListener('mousemove', this.mouseHandle, false);
        window.removeEventListener('resize', this.init, false);
      }
    }, {
      key: 'clickHandle',
      value: function clickHandle(e) {
        this.clickPause && this.toggleAnimateStatus();
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

          _this.cxt.clearRect(0, 0, _this.width, _this.height);
          _this.renderBackground();
          _this.render();
          _this.renderText();
          _this.update();
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, {
      key: 'toggleAnimateStatus',
      value: function toggleAnimateStatus() {
        if (this.isAnimate) {
          this.isAnimate = false;
        } else {
          this.start();
        }
      }
    }, {
      key: 'getColorList',
      value: function getColorList(color) {
        //  颜色差值[r, g, b]
        var startColor = color[0];
        var endColor = color[1];

        var ColorDis = endColor.map(function (end, i) {
          return end - startColor[i];
        });

        //  颜色差最大的绝对值
        var ColorLength = Math.max(Math.abs(ColorDis[0]), Math.abs(ColorDis[1]), Math.abs(ColorDis[2]));

        //  颜色变化系数
        var ColorChange = ColorDis.map(function (c) {
          return c / ColorLength;
        });

        var ColorList = [];

        var _loop = function _loop(i) {
          ColorList.push(ColorChange.map(function (c, index) {
            return color[0][index] + c * i;
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
          vx: this.getRandomNumber(this.speed), // 水平方向加速度
          vy: this.getRandomNumber(this.speed), // 垂直方向加速度
          opacity: this.getRandomNumber(this.opacity), // 透明度
          is_infect: false, // 是否被鼠标颜色感染
          type: ~~this.getRandomNumber([0, 3]), // 小球类型[-1:鼠标, 0:实心球, 1:圆环, 2:双环]
          reverse: false, // 是否反向颜色渐变
          withMouse: 0 // 与鼠标位置的关系  [0:范围外, 1:范围内, 2:球中]
        };

        ball.r = (1 - ball.opacity) * (this.r_range[1] - this.r_range[0]) + this.r_range[0];
        ball.x = this.getRandomNumber([ball.r, this.width - ball.r]);
        ball.y = this.getRandomNumber([ball.r, this.height - ball.r]);

        if (this.isOverlap(ball)) {
          return this.addBall();
        }

        Object.assign(ball, this.initGradientData(this.period, this.color));

        switch (ball.type) {
          case 0:
            break;
          case 1:
            ball.emptyR = this.getRandomNumber([ball.r / 2, ball.r / 4 * 3]);
            break;
          case 2:
            ball.emptyR = this.getRandomNumber([ball.r / 2, ball.r / 4 * 3]);
            ball.sonR = this.getRandomNumber([ball.emptyR / 2, ball.emptyR / 4 * 3]);
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
      key: 'getBalls',
      value: function getBalls() {
        var ball = null;
        var balls = [];

        for (var i = 0, len = this.vballs.length; i < len; i++) {
          ball = this.vballs[i];
          balls.push(ball);
          balls = balls.concat(this.addMirrorBalls(ball));
        }

        return balls;
      }
    }, {
      key: 'addMirrorBalls',
      value: function addMirrorBalls(ball) {
        var range = this.r_range[1] * 4;
        var balls = [];
        var newPos = {};
        if (ball.x < range) {
          newPos.x = ball.x + this.width;
        }
        if (ball.x > this.width - range) {
          newPos.x = ball.x - this.width;
        }
        if (ball.y < range) {
          newPos.y = ball.y + this.height;
        }
        if (ball.y > this.height - range) {
          newPos.y = ball.y - this.height;
        }

        for (var i in newPos) {
          var _addMirrorBall;

          balls.push(this.addMirrorBall(ball, (_addMirrorBall = {}, _defineProperty(_addMirrorBall, i, newPos[i]), _defineProperty(_addMirrorBall, 'parent', ball), _addMirrorBall)));
        }

        if (Object.keys(newPos).length === 2) {
          balls.push(this.addMirrorBall(ball, { x: newPos.x, y: newPos.y, parent: ball }));
        }

        return balls;
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
      key: 'render',
      value: function render(progress) {
        var _this2 = this;

        this.balls.length = 0;

        this.balls = this.getBalls();

        this.balls.push(this.mouse);

        this.mouse.noLine = this.mouse.catchBall;
        this.mouse.catchBall = false;
        Array.from(this.balls, function (ball, i) {
          _this2.renderBall(ball, i);
        });
      }
    }, {
      key: 'renderBall',
      value: function renderBall(ball, i) {
        var _this3 = this;

        var x = ball.x;
        var y = ball.y;
        var color = ball.color;

        //  连线
        Array.from(this.balls, function (b, index) {
          if (index <= i) {
            return false;
          }

          var d = Math.sqrt(Math.pow(x - b.x, 2) + Math.pow(y - b.y, 2));
          if (d < _this3.line_range && d > ball.r + b.r) {
            if (b.type === -1) {
              ball.withMouse = 1;
              ball.is_infect = true;

              if (_this3.mouse.noLine) {
                return false;
              }
            }
            var opacity = 1 - d / _this3.line_range;
            var ballColor = _this3.getRGBA(color, opacity);
            var bColor = _this3.getRGBA(b.color, opacity);

            _this3.cxt.save();

            var g = _this3.cxt.createLinearGradient(x, y, b.x, b.y);

            if (ball.type === 1) {
              g.addColorStop(0, ballColor);
              g.addColorStop(ball.emptyR / d, ballColor);
              g.addColorStop(ball.emptyR / d, 'transparent');
            } else if (ball.type === 2) {
              g.addColorStop(0, 'transparent');
              g.addColorStop(ball.sonR / d, 'transparent');
              g.addColorStop(ball.sonR / d, ballColor);
              g.addColorStop(ball.emptyR / d, ballColor);
              g.addColorStop(ball.emptyR / d, 'transparent');
            } else {
              g.addColorStop(0, 'transparent');
            }
            g.addColorStop(ball.r / d, 'transparent');
            g.addColorStop(ball.r / d, ballColor);
            g.addColorStop(1 - b.r / d, bColor);
            g.addColorStop(1 - b.r / d, 'transparent');
            g.addColorStop(1, 'transparent');

            _this3.cxt.strokeStyle = g;
            _this3.renderLine(x, y, b.x, b.y);

            _this3.cxt.restore();
          } else if (d < ball.r + b.r && !b.isCrash && !ball.isCrash) {
            if (b.type === -1) {
              ball.withMouse = 2;
              ball.is_infect = true;
              _this3.mouse.catchBall = true;
            } else {
              ball.isCrash = true;
              b.isCrash = true;
              _this3.crashHandle(ball, b);

              if (ball.parent) {
                ball.parent.isCrash = true;
              }

              if (b.parent) {
                b.parent.isCrash = true;
              }
            }
          } else if (b.type === -1) {
            ball.withMouse = 0;
            ball.is_infect = false;
          }
        });

        //  大球体
        if (ball.type === 0) {
          this.renderTypeArc(x, y, ball.r, this.getRGBA(color, ball.opacity));
        } else if (ball.type === 1) {
          this.renderTypeArc(x, y, ball.r, this.getRGBA(color, ball.opacity), ball.emptyR);
        } else if (ball.type === 2) {
          this.renderTypeArc(x, y, ball.r, this.getRGBA(color, ball.opacity), ball.emptyR, ball.sonR);
        }
      }
    }, {
      key: 'resetColorList',
      value: function resetColorList(ball) {
        ball.cur_i = 0;
        ball.reverse = false;
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
        var _this4 = this;

        this.vballs = this.vballs.map(function (ball) {
          if (ball.x < -ball.r) {
            ball.x = ball.x + _this4.width;
          } else if (ball.x > _this4.width + ball.r) {
            ball.x = ball.x - _this4.width;
          } else if (ball.y < -ball.r) {
            ball.y = ball.y + _this4.height;
          } else if (ball.y > _this4.height + ball.r) {
            ball.y = ball.y - _this4.height;
          }

          if (ball.isCrash) {
            ball.isCrash = false;

            ball.vx = ball.fx;
            ball.vy = ball.fy;
          }

          if (ball.withMouse === 1) {
            var g = Math.random() * 0.02;

            if (ball.y > _this4.mouse.y) {
              ball.vy = ball.vy * 0.99 + g;
            } else {
              ball.vy = ball.vy * 0.99 - g;
            }

            if (ball.x > _this4.mouse.x) {
              ball.vx = ball.vx * 0.99 + g;
            } else {
              ball.vx = ball.vx * 0.99 - g;
            }
          }
          if (ball.withMouse !== 2) {
            ball.x += ball.vx;
            ball.y += ball.vy;
          }

          _this4.updateGradientData(ball);

          return ball;
        });

        this.updateGradientData(this.mouse);
        this.updateGradientData(this.bg);
        this.updateGradientData(this.text);
      }
    }, {
      key: 'initGradientData',
      value: function initGradientData(period, colors) {
        var ColorList = this.getColorList(colors);
        return {
          cur_i: 0, // 当前颜色step
          cur_color: 0, // 当前颜色组索引
          color: colors[0], // 当前颜色
          changeValue: ColorList.length / (period / 16.7), // 每次渲染变化量
          ColorList: ColorList, // 当前颜色范围
          ColorGroup: colors // 渐变颜色组
        };
      }
    }, {
      key: 'updateGradientData',
      value: function updateGradientData(ball) {
        var _this5 = this;

        var index = void 0;

        if (ball.ColorGroup[ball.cur_color][3]) {
          var v = ball.ColorGroup[ball.cur_color][3] / 16.7;
          if (ball.cur_i <= v) {
            ball.cur_i += 1;
            return false;
          } else {
            ball.cur_i += ball.changeValue;
            index = ~~(ball.cur_i - v);
          }
        } else {
          ball.cur_i += ball.changeValue;
          index = ~~ball.cur_i;
        }

        if (index === ball.cur_i) {
          return false;
        }
        ball.color = ball.color.map(function (n, i) {
          if (index >= ball.ColorList.length) {
            ball.cur_i = index = 0;
            ball.cur_color++;
            ball.cur_color = ball.cur_color % ball.ColorGroup.length;
            if (ball.cur_color === ball.ColorGroup.length - 1) {
              ball.ColorList = _this5.getColorList([ball.ColorGroup[ball.cur_color], ball.ColorGroup[0]]);
            } else {
              ball.ColorList = _this5.getColorList([ball.ColorGroup[ball.cur_color], ball.ColorGroup[ball.cur_color + 1]]);
            }
          }
          return ball.ColorList[index][i];
        });
      }
    }, {
      key: 'getRGBA',
      value: function getRGBA(color) {
        var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

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
      key: 'renderTypeArc',
      value: function renderTypeArc(x, y, r, color, innerR, centerR) {
        this.cxt.fillStyle = color;

        this.cxt.beginPath();
        this.cxt.arc(x, y, r, 0, Math.PI * 2, true);
        innerR && this.cxt.arc(x, y, innerR, 0, Math.PI * 2, false);
        centerR && this.cxt.arc(x, y, centerR, 0, Math.PI * 2, true);

        this.cxt.fill();
      }
    }, {
      key: 'renderArc',
      value: function renderArc(x, y, r, color) {
        this.cxt.fillStyle = color;

        this.cxt.beginPath();
        this.cxt.arc(x, y, r, 0, Math.PI * 2, true);

        this.cxt.fill();
      }
    }, {
      key: 'renderRing',
      value: function renderRing(x, y, r, color, innerR) {
        this.cxt.fillStyle = color;

        this.cxt.beginPath();
        this.cxt.arc(x, y, r, 0, Math.PI * 2, true);
        this.cxt.arc(x, y, innerR, 0, Math.PI * 2, false);

        this.cxt.fill();
      }
    }, {
      key: 'renderDoubleArc',
      value: function renderDoubleArc(x, y, r, color, innerR, centerR) {
        this.cxt.fillStyle = color;

        this.cxt.beginPath();
        this.cxt.arc(x, y, r, 0, Math.PI * 2, true);
        this.cxt.arc(x, y, innerR, 0, Math.PI * 2, false);
        this.cxt.arc(x, y, r, 0, Math.PI * 2, true);

        this.cxt.fill();
      }
    }, {
      key: 'renderLine',
      value: function renderLine(x1, y1, x2, y2) {
        this.cxt.beginPath();
        this.cxt.moveTo(x1, y1);
        this.cxt.lineTo(x2, y2);

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
    }, {
      key: 'renderBackground',
      value: function renderBackground() {
        this.cxt.fillStyle = this.getRGBA(this.bg.color, 1);
        this.cxt.fillRect(0, 0, this.width, this.height);
      }
    }, {
      key: 'renderText',
      value: function renderText() {
        this.cxt.save();

        this.cxt.font = this.font;
        this.cxt.textAlign = 'center';
        this.cxt.fillStyle = this.getRGBA(this.text.color);
        this.cxt.fillText(this.txt, this.width / 2, this.height / 2);

        this.cxt.restore();
      }
    }]);

    return Canvas;
  }();

  exports.default = Canvas;
});