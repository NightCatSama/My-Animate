(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', 'wave'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('wave'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.wave);
		global.canvas = mod.exports;
	}
})(this, function (exports, _wave) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _wave2 = _interopRequireDefault(_wave);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
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

	var _default = {
		width: document.body.offsetWidth, //canvas的宽度，默认窗口宽度
		height: document.body.offsetHeight, //canvas的高度，默认窗口高度
		x: 0,
		y: 0,
		r: 1
	};

	var Canvas = function () {
		function Canvas(el, option) {
			_classCallCheck(this, Canvas);

			Object.assign(this, _default, option);
			this.canvas = el;
			this.particles = [];
			this.cxt = this.canvas.getContext('2d');
			this.isAnimate = false;
			this.init();
		}

		_createClass(Canvas, [{
			key: 'init',
			value: function init() {
				this.setSize(this.canvas);
				this.createMask();
				this.createColorCanvas();
				this.bounds = this.canvas.getBoundingClientRect();
			}
		}, {
			key: 'createMask',
			value: function createMask() {
				this.wrap = document.createElement('span');
				this.wrap.style.position = 'relative';
				this.mask = new _wave2.default({
					width: this.width,
					height: this.height
				});

				this.mask.fn = this.updateColors.bind(this);
				// this.mask.cb = this.renderColors.bind(this)

				var parentNode = this.canvas.parentNode;
				this.wrap.appendChild(this.canvas);
				this.wrap.appendChild(this.mask.canvas);
				parentNode.appendChild(this.wrap);
			}
		}, {
			key: 'createColorCanvas',
			value: function createColorCanvas() {
				this.colorCanvas = document.createElement('canvas');
				this.setSize(this.colorCanvas);
				this.colorCanvas.style.cssText = 'position: absolute; left: 0; top: 0; z-index: 1;';
				this.colorCanvasCxt = this.colorCanvas.getContext('2d');
				this.wrap.appendChild(this.colorCanvas);
			}
		}, {
			key: 'destory',
			value: function destory() {
				this.cxt.clearRect(0, 0, this.width, this.height);
				this.stop();
			}
		}, {
			key: 'getMousePos',
			value: function getMousePos(e) {
				this.mx = e.clientX - this.bounds.left;
				this.my = e.clientY - this.bounds.top;
				this.update();
			}
		}, {
			key: 'setSize',
			value: function setSize(el) {
				el.width = this.width;
				el.height = this.height;
			}
		}, {
			key: 'start',
			value: function start() {
				var _this = this;

				if (this.isAnimate) return false;

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
			key: 'stop',
			value: function stop() {
				this.isAnimate = false;
			}
		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;

				this.cxt.clearRect(0, 0, this.width, this.height);

				Array.from(this.particles, function (particle) {
					_this2.cxt.fillStyle = 'rgba(' + particle.grayColor + ')';

					_this2.cxt.beginPath();
					_this2.cxt.arc(particle.x, particle.y, _this2.r, 0, 2 * Math.PI, true);
					_this2.cxt.closePath();

					_this2.cxt.fill();
				});
			}
		}, {
			key: 'renderColors',
			value: function renderColors(canvas) {
				this.cxt.drawImage(canvas, this.x, this.y);
			}
		}, {
			key: 'updateColors',
			value: function updateColors() {
				var _this3 = this;

				if (this.mask.wave.length === 0) return false;
				// 离屏渲染
				var now = Date.now();
				this.colorCanvasCxt.clearRect(0, 0, this.width, this.height);
				Array.from(this.mask.wave, function (obj) {
					obj.canvas.width = _this3.width;
					obj.canvas.height = _this3.height;
					var cxt = obj.cxt;
					cxt.beginPath();
					var v = obj.arc[0];
					var tr = (1 - (now - obj.timeStamp) / obj.live) * (obj.initialTr - obj.lastTr) + obj.lastTr;
					cxt.globalAlpha = tr < 0 ? 0 : tr;
					// cxt.globalAlpha = v.opacity
					cxt.arc(obj.x, obj.y, v.r, 0, 2 * Math.PI, true);
					cxt.closePath();
					cxt.clip();
					if (obj.main) {
						_this3.color_img && cxt.drawImage(_this3.color_img, _this3.x, _this3.y, _this3.img_width, _this3.img_height);
						cxt.drawImage(_this3.img, _this3.x, _this3.y, _this3.img_width, _this3.img_height);
					} else {
						cxt.drawImage(_this3.img, _this3.x, _this3.y, _this3.img_width, _this3.img_height);
						_this3.color_img && cxt.drawImage(_this3.color_img, _this3.x, _this3.y, _this3.img_width, _this3.img_height);
					}
					_this3.colorCanvasCxt.drawImage(obj.canvas, _this3.x, _this3.y);
				});
			}
		}, {
			key: 'setImage',
			value: function setImage(src, type) {
				var _this4 = this;

				var img = new Image();
				img.onload = function () {
					if (type === 'colors') {
						_this4.color_img = img;
						_this4.color_img.width = _this4.width;
						_this4.color_img.height = _this4.height;
					} else {
						_this4.img = img;
						_this4.img_width = _this4.img.width = _this4.width;
						_this4.img_height = _this4.img.height = _this4.height;
						_this4.cxt.drawImage(_this4.img, _this4.x, _this4.y, _this4.img_width, _this4.img_height);
						_this4.setGrayImage();
						/* 图片粒子化, 目前未用到 */
						// this.getParticle()
						// this.render()
					}
				};
				img.src = src;
			}
		}, {
			key: 'getParticle',
			value: function getParticle() {
				this.particles = [];

				var _getImageData = this.getImageData(),
				    arr = _getImageData.arr,
				    grayArr = _getImageData.grayArr;

				var s_width = 1;
				var s_height = 1;
				var pos = 0;
				for (var i = 0; i < this.img_width; i++) {
					for (var j = 0; j < this.img_height; j++) {
						pos = j * s_height * this.img_width + i * s_width;
						var x = this.x + i * s_width;
						var y = this.y + j * s_height;
						var particle = {
							x: x,
							y: y,
							ox: x,
							oy: y,
							vx: 0,
							vy: 0,
							color: arr[pos].join(','),
							grayColor: grayArr[pos].join(',')
						};
						this.particles.push(particle);
					}
				}
			}
		}, {
			key: 'getImageData',
			value: function getImageData() {
				var imageData = this.cxt.getImageData(this.x, this.y, this.img_width, this.img_height);
				var data = imageData.data;
				var len = imageData.data.length;
				var arr = [];
				var grayArr = [];
				//迷之不相等？
				if (imageData.width !== this.img_width) this.img_width = imageData.width;
				if (imageData.height !== this.img_height) this.img_height = imageData.height;
				for (var i = 0; i < len / 4; i++) {
					var gray = parseInt((data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3);
					arr.push([data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]]);
					grayArr.push([gray, gray, gray, 1]);
				}
				return {
					arr: arr,
					grayArr: grayArr
				};
			}
		}, {
			key: 'setGrayImage',
			value: function setGrayImage() {
				var imageData = this.cxt.getImageData(this.x, this.y, this.img_width, this.img_height);
				var data = imageData.data;
				var len = imageData.data.length;
				var arr = [];
				var grayArr = [];
				//迷之不相等？
				if (imageData.width !== this.img_width) this.img_width = imageData.width;
				if (imageData.height !== this.img_height) this.img_height = imageData.height;
				for (var i = 0; i < len / 4; i++) {
					var gray = parseInt((data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3);
					data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = gray;
				}
				this.cxt.putImageData(imageData, 0, 0);
			}
		}]);

		return Canvas;
	}();

	exports.default = Canvas;
});