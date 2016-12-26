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
		global.wave = mod.exports;
	}
})(this, function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

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
		width: document.body.offsetWidth,
		height: document.body.offsetHeight,
		x: 0,
		y: 0,
		r: 1
	};

	var Wave = function () {
		function Wave(option) {
			_classCallCheck(this, Wave);

			Object.assign(this, _default, option);
			this.isAnimate = false;
			this.wave = [];
			this.fn = null;
			this.cb = null;
			this.init();
		}

		_createClass(Wave, [{
			key: 'init',
			value: function init() {
				this.createCanvas();
				this.setSize();
				this.bindEvent();
			}
		}, {
			key: 'createCanvas',
			value: function createCanvas() {
				this.canvas = document.createElement('canvas');
				this.canvas.style.cssText = 'position: absolute; left: 0; top: 0; z-index: 2;';
				this.bounds = this.canvas.getBoundingClientRect();
				this.cxt = this.canvas.getContext('2d');
			}
		}, {
			key: 'setSize',
			value: function setSize() {
				this.canvas.width = this.width;
				this.canvas.height = this.height;
			}
		}, {
			key: 'destory',
			value: function destory() {
				this.cxt.clearRect(0, 0, this.width, this.height);
				this.stop();
			}
		}, {
			key: 'bindEvent',
			value: function bindEvent() {
				this.canvas.addEventListener('click', this.getMousePos.bind(this));
			}
		}, {
			key: 'getMousePos',
			value: function getMousePos(e) {
				e.stopPropagation();
				var mx = e.clientX - this.bounds.left;
				var my = e.clientY - this.bounds.top;
				this.addWave(mx, my);
			}
		}, {
			key: 'addWave',
			value: function addWave(x, y) {
				var canvasOffscreen = document.createElement('canvas');
				canvasOffscreen.width = this.width;
				canvasOffscreen.height = this.height;
				// let val = Math.max(this.width, this.height)

				var wave = {
					x: x,
					y: y,
					initialTr: 0.6,
					main: x < this.width / 2,
					lastTr: 0,
					timeStamp: Date.now(),
					live: 2000,
					// live: val / 180 * 1000,
					canvas: canvasOffscreen,
					cxt: canvasOffscreen.getContext('2d'),
					arc: [{
						r: 0,
						vr: 5,
						width: 0.5,
						transprent: 0.36,
						color: 'rgba(255, 255, 255,'
					}, {
						r: -20,
						vr: 5,
						width: 3,
						transprent: 0.2,
						color: 'rgba(211, 211, 211,'
					}, {
						r: -50,
						vr: 3,
						width: 1,
						transprent: 0.2,
						color: 'rgba(255, 255, 255,'
					}, {
						r: -50,
						vr: 2.8,
						width: 0.8,
						transprent: 0.1,
						color: 'rgba(156, 156, 156,'
					}, {
						r: -50,
						vr: 3,
						width: 0.8,
						transprent: 0.2,
						color: 'rgba(156, 156, 156,'
					}]
				};
				this.wave.push(wave);
				this.start();
			}
		}, {
			key: 'start',
			value: function start() {
				var _this = this;

				if (this.isAnimate) return false;

				this.isAnimate = true;
				var step = function step() {
					if (!_this.isAnimate) return false;
					_this.fn && _this.fn();
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
				this.cxt.shadowColor = 'rgba(0, 0, 0, 0.46)';
				this.cxt.shadowOffsetX = -5;
				this.cxt.shadowOffsetX = -5;
				this.cxt.shadowBlur = 10;

				Array.from(this.wave, function (obj) {
					Array.from(obj.arc, function (v) {
						if (v.r < 0) return false;

						var arr = [{ x: obj.x, y: obj.y, isReflect: false }, { x: -obj.x, y: obj.y, isReflect: true }, { x: obj.x, y: -obj.y, isReflect: true }, { x: _this2.width * 2 - obj.x, y: obj.y, isReflect: true }, { x: obj.x, y: _this2.height * 2 - obj.y, isReflect: true }];
						arr.map(function (_ref) {
							var x = _ref.x,
							    y = _ref.y,
							    isReflect = _ref.isReflect;

							_this2.cxt.strokeStyle = v.color + v.opacity * (isReflect ? 0.8 : 1) + ')';
							_this2.cxt.lineWidth = v.width * (isReflect ? 0.8 : 1);
							_this2.cxt.beginPath();
							_this2.cxt.arc(x, y, v.r, 0, 2 * Math.PI, true);
							_this2.cxt.closePath();

							_this2.cxt.stroke();
						});
					});
				});
			}
		}, {
			key: 'update',
			value: function update() {
				var now = Date.now();
				this.wave = this.wave.filter(function (obj) {
					obj.arc = obj.arc.filter(function (v) {
						if (now - obj.timeStamp > obj.live) {
							return false;
						} else {
							v.opacity = (1 - (now - obj.timeStamp) / obj.live) * v.transprent;
						}

						v.r += v.vr;

						return true;
					});
					if (obj.arc.length === 0) {
						// this.cb && this.cb(obj.canvas)
						return false;
					}
					return true;
				});
				if (this.wave.length === 0) {
					this.stop();
				}
			}
		}]);

		return Wave;
	}();

	exports.default = Wave;
});