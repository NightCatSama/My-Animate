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
				this.bounds = this.canvas.getBoundingClientRect();
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
				var val = Math.max(this.width, this.height);

				var wave = {
					x: x,
					y: y,
					initialTr: 1,
					lastTr: 0.5,
					timeStamp: Date.now(),
					// live: parseInt(Math.random() * 2) * 1000 + 3000,
					live: val / 180 * 1000,
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

							_this2.cxt.strokeStyle = v.color + v.opacity * (isReflect ? 0.6 : 1) + ')';
							_this2.cxt.lineWidth = v.width * (isReflect ? 0.6 : 1);
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
				var _this3 = this;

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
						_this3.cb && _this3.cb(obj.canvas);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdmUuanMiXSwibmFtZXMiOlsiX2RlZmF1bHQiLCJ3aWR0aCIsImRvY3VtZW50IiwiYm9keSIsIm9mZnNldFdpZHRoIiwiaGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwieCIsInkiLCJyIiwiV2F2ZSIsIm9wdGlvbiIsIk9iamVjdCIsImFzc2lnbiIsImlzQW5pbWF0ZSIsIndhdmUiLCJmbiIsImNiIiwiaW5pdCIsImNyZWF0ZUNhbnZhcyIsInNldFNpemUiLCJiaW5kRXZlbnQiLCJjYW52YXMiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJjc3NUZXh0IiwiY3h0IiwiZ2V0Q29udGV4dCIsImNsZWFyUmVjdCIsInN0b3AiLCJhZGRFdmVudExpc3RlbmVyIiwiZ2V0TW91c2VQb3MiLCJiaW5kIiwiZSIsImJvdW5kcyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIm14IiwiY2xpZW50WCIsImxlZnQiLCJteSIsImNsaWVudFkiLCJ0b3AiLCJhZGRXYXZlIiwiY2FudmFzT2Zmc2NyZWVuIiwidmFsIiwiTWF0aCIsIm1heCIsImluaXRpYWxUciIsImxhc3RUciIsInRpbWVTdGFtcCIsIkRhdGUiLCJub3ciLCJsaXZlIiwiYXJjIiwidnIiLCJ0cmFuc3ByZW50IiwiY29sb3IiLCJwdXNoIiwic3RhcnQiLCJzdGVwIiwicmVuZGVyIiwidXBkYXRlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2hhZG93Q29sb3IiLCJzaGFkb3dPZmZzZXRYIiwic2hhZG93Qmx1ciIsIkFycmF5IiwiZnJvbSIsIm9iaiIsInYiLCJhcnIiLCJpc1JlZmxlY3QiLCJtYXAiLCJzdHJva2VTdHlsZSIsIm9wYWNpdHkiLCJsaW5lV2lkdGgiLCJiZWdpblBhdGgiLCJQSSIsImNsb3NlUGF0aCIsInN0cm9rZSIsImZpbHRlciIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxLQUFNQSxXQUFXO0FBQ2hC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J1xyXG5cclxuY29uc3QgX2RlZmF1bHQgPSB7XHJcblx0d2lkdGg6IGRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGgsXHJcblx0aGVpZ2h0OiBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCxcclxuXHR4OiAwLFxyXG5cdHk6IDAsXHJcblx0cjogMVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXZlIHtcclxuXHRjb25zdHJ1Y3RvcihvcHRpb24pIHtcclxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgX2RlZmF1bHQsIG9wdGlvbilcclxuXHRcdHRoaXMuaXNBbmltYXRlID0gZmFsc2VcclxuXHRcdHRoaXMud2F2ZSA9IFtdXHJcblx0XHR0aGlzLmZuID0gbnVsbFxyXG5cdFx0dGhpcy5jYiA9IG51bGxcclxuXHRcdHRoaXMuaW5pdCgpXHJcblx0fVxyXG5cdGluaXQoKSB7XHJcblx0XHR0aGlzLmNyZWF0ZUNhbnZhcygpXHJcblx0XHR0aGlzLnNldFNpemUoKVxyXG5cdFx0dGhpcy5iaW5kRXZlbnQoKVxyXG5cdH1cclxuXHRjcmVhdGVDYW52YXMoKSB7XHJcblx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXHJcblx0XHR0aGlzLmNhbnZhcy5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyB6LWluZGV4OiAyOydcclxuXHRcdHRoaXMuY3h0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG5cdH1cclxuXHRzZXRTaXplKCkge1xyXG5cdFx0dGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoXHJcblx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodFxyXG5cdH1cclxuXHRkZXN0b3J5KCkge1xyXG5cdFx0dGhpcy5jeHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxyXG5cdFx0dGhpcy5zdG9wKClcclxuXHR9XHJcblx0YmluZEV2ZW50KCkge1xyXG5cdFx0dGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmdldE1vdXNlUG9zLmJpbmQodGhpcykpXHJcblx0fVxyXG5cdGdldE1vdXNlUG9zKGUpIHtcclxuXHRcdHRoaXMuYm91bmRzID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuXHQgICAgbGV0IG14ID0gZS5jbGllbnRYIC0gdGhpcy5ib3VuZHMubGVmdFxyXG5cdFx0bGV0IG15ID0gZS5jbGllbnRZIC0gdGhpcy5ib3VuZHMudG9wXHJcblx0XHR0aGlzLmFkZFdhdmUobXgsIG15KVxyXG5cdH1cclxuXHRhZGRXYXZlKHgsIHkpIHtcclxuXHRcdHZhciBjYW52YXNPZmZzY3JlZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxyXG5cdFx0Y2FudmFzT2Zmc2NyZWVuLndpZHRoID0gdGhpcy53aWR0aFxyXG5cdFx0Y2FudmFzT2Zmc2NyZWVuLmhlaWdodCA9IHRoaXMuaGVpZ2h0XHJcblx0XHRsZXQgdmFsID0gTWF0aC5tYXgodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXHJcblxyXG5cdFx0bGV0IHdhdmUgPSB7XHJcblx0XHRcdHg6IHgsXHJcblx0XHRcdHk6IHksXHJcblx0XHRcdGluaXRpYWxUcjogMSxcclxuXHRcdFx0bGFzdFRyOiAwLjUsXHJcblx0XHRcdHRpbWVTdGFtcDogRGF0ZS5ub3coKSxcclxuXHRcdFx0Ly8gbGl2ZTogcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIDIpICogMTAwMCArIDMwMDAsXHJcblx0XHRcdGxpdmU6IHZhbCAvIDE4MCAqIDEwMDAsXHJcblx0XHRcdGNhbnZhczogY2FudmFzT2Zmc2NyZWVuLFxyXG5cdFx0XHRjeHQ6IGNhbnZhc09mZnNjcmVlbi5nZXRDb250ZXh0KCcyZCcpLFxyXG5cdFx0XHRhcmM6IFt7XHJcblx0XHRcdFx0cjogMCxcclxuXHRcdFx0XHR2cjogNSxcclxuXHRcdFx0XHR3aWR0aDogMC41LFxyXG5cdFx0XHRcdHRyYW5zcHJlbnQ6IDAuMzYsXHJcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsJ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0cjogLTIwLFxyXG5cdFx0XHRcdHZyOiA1LFxyXG5cdFx0XHRcdHdpZHRoOiAzLFxyXG5cdFx0XHRcdHRyYW5zcHJlbnQ6IDAuMixcclxuXHRcdFx0XHRjb2xvcjogJ3JnYmEoMjExLCAyMTEsIDIxMSwnXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRyOiAtNTAsXHJcblx0XHRcdFx0dnI6IDMsXHJcblx0XHRcdFx0d2lkdGg6IDAuOCxcclxuXHRcdFx0XHR0cmFuc3ByZW50OiAwLjIsXHJcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDE1NiwgMTU2LCAxNTYsJ1xyXG5cdFx0XHR9XVxyXG5cdFx0fVxyXG5cdFx0dGhpcy53YXZlLnB1c2god2F2ZSlcclxuXHRcdHRoaXMuc3RhcnQoKVxyXG5cdH1cclxuXHRzdGFydCgpIHtcclxuXHRcdGlmICh0aGlzLmlzQW5pbWF0ZSkgcmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0dGhpcy5pc0FuaW1hdGUgPSB0cnVlXHJcblx0XHRjb25zdCBzdGVwID0gKCkgPT4ge1xyXG5cdFx0XHRpZiAoIXRoaXMuaXNBbmltYXRlKSByZXR1cm4gZmFsc2VcclxuXHRcdFx0dGhpcy5mbiAmJiB0aGlzLmZuKClcclxuXHRcdFx0dGhpcy5yZW5kZXIoKVxyXG5cdFx0XHR0aGlzLnVwZGF0ZSgpXHJcblx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG5cdFx0fVxyXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcblx0fVxyXG5cdHN0b3AoKSB7XHJcblx0XHR0aGlzLmlzQW5pbWF0ZSA9IGZhbHNlXHJcblx0fVxyXG5cdHJlbmRlcigpIHtcclxuXHRcdHRoaXMuY3h0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcclxuXHRcdHRoaXMuY3h0LnNoYWRvd0NvbG9yID0gJ3JnYmEoMCwgMCwgMCwgMC40NiknXHJcblx0XHR0aGlzLmN4dC5zaGFkb3dPZmZzZXRYID0gLTVcclxuXHRcdHRoaXMuY3h0LnNoYWRvd09mZnNldFggPSAtNVxyXG5cdFx0dGhpcy5jeHQuc2hhZG93Qmx1ciA9IDEwXHJcblxyXG5cdFx0QXJyYXkuZnJvbSh0aGlzLndhdmUsIG9iaiA9PiB7XHJcblx0XHRcdEFycmF5LmZyb20ob2JqLmFyYywgdiA9PiB7XHJcblx0XHRcdFx0aWYgKHYuciA8IDApIHJldHVybiBmYWxzZVxyXG5cclxuXHRcdFx0XHRsZXQgYXJyID0gW3sgeDogb2JqLngsIHk6IG9iai55LCBpc1JlZmxlY3Q6IGZhbHNlIH0sIHsgeDogLW9iai54LCB5OiBvYmoueSwgaXNSZWZsZWN0OiB0cnVlIH0sIHsgeDogb2JqLngsIHk6IC1vYmoueSwgaXNSZWZsZWN0OiB0cnVlIH0sIHsgeDogdGhpcy53aWR0aCAqIDIgLSBvYmoueCwgeTogb2JqLnksIGlzUmVmbGVjdDogdHJ1ZSB9LCB7IHg6IG9iai54LCB5OiB0aGlzLmhlaWdodCAqIDIgLSBvYmoueSwgaXNSZWZsZWN0OiB0cnVlIH1dXHJcblx0XHRcdFx0YXJyLm1hcCgoeyB4LCB5LCBpc1JlZmxlY3QgfSkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5jeHQuc3Ryb2tlU3R5bGUgPSB2LmNvbG9yICsgKHYub3BhY2l0eSAqIChpc1JlZmxlY3QgPyAwLjYgOiAxKSkgKyAnKSdcclxuXHRcdFx0XHRcdHRoaXMuY3h0LmxpbmVXaWR0aCA9IHYud2lkdGggKiAoaXNSZWZsZWN0ID8gMC42IDogMSlcclxuXHRcdFx0XHRcdHRoaXMuY3h0LmJlZ2luUGF0aCgpXHJcblx0XHRcdFx0XHR0aGlzLmN4dC5hcmMoeCwgeSwgdi5yLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSlcclxuXHRcdFx0XHRcdHRoaXMuY3h0LmNsb3NlUGF0aCgpXHJcblxyXG5cdFx0XHRcdFx0dGhpcy5jeHQuc3Ryb2tlKClcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0fSlcclxuXHR9XHJcblx0dXBkYXRlKCkge1xyXG5cdFx0bGV0IG5vdyA9IERhdGUubm93KClcclxuXHRcdHRoaXMud2F2ZSA9IHRoaXMud2F2ZS5maWx0ZXIob2JqID0+IHtcclxuXHRcdFx0b2JqLmFyYyA9IG9iai5hcmMuZmlsdGVyKHYgPT4ge1xyXG5cdFx0XHRcdGlmIChub3cgLSBvYmoudGltZVN0YW1wID4gb2JqLmxpdmUpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHYub3BhY2l0eSA9ICgxIC0gKG5vdyAtIG9iai50aW1lU3RhbXApIC8gb2JqLmxpdmUpICogdi50cmFuc3ByZW50XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2LnIgKz0gdi52clxyXG5cclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHR9KVxyXG5cdFx0XHRpZiAob2JqLmFyYy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHR0aGlzLmNiICYmIHRoaXMuY2Iob2JqLmNhbnZhcylcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0fSlcclxuXHRcdGlmICh0aGlzLndhdmUubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdHRoaXMuc3RvcCgpXHJcblx0XHR9XHJcblx0fVxyXG59Il19
