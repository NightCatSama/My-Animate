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
					lastTr: .5,
					timeStamp: Date.now(),
					// live: parseInt(Math.random() * 2) * 1000 + 10000,
					live: val / 180 * 1000,
					canvas: canvasOffscreen,
					cxt: canvasOffscreen.getContext('2d'),
					arc: [{
						r: 0,
						vr: 3,
						width: 0.5,
						transprent: 0.36,
						color: 'rgba(255, 255, 255,'
					}, {
						r: -5,
						vr: 3,
						width: 3,
						transprent: 0.2,
						color: 'rgba(211, 211, 211,'
					}, {
						r: 0,
						vr: 2.8,
						width: 1,
						transprent: 0.2,
						color: 'rgba(255, 255, 255,'
					}, {
						r: -20,
						vr: 2,
						width: 1,
						transprent: 0.3,
						color: 'rgba(255, 255, 255,'
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdmUuanMiXSwibmFtZXMiOlsiX2RlZmF1bHQiLCJ3aWR0aCIsImRvY3VtZW50IiwiYm9keSIsIm9mZnNldFdpZHRoIiwiaGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwieCIsInkiLCJyIiwiV2F2ZSIsIm9wdGlvbiIsIk9iamVjdCIsImFzc2lnbiIsImlzQW5pbWF0ZSIsIndhdmUiLCJmbiIsImNiIiwiaW5pdCIsImNyZWF0ZUNhbnZhcyIsInNldFNpemUiLCJiaW5kRXZlbnQiLCJjYW52YXMiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJjc3NUZXh0IiwiY3h0IiwiZ2V0Q29udGV4dCIsImNsZWFyUmVjdCIsInN0b3AiLCJhZGRFdmVudExpc3RlbmVyIiwiZ2V0TW91c2VQb3MiLCJiaW5kIiwiZSIsImJvdW5kcyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIm14IiwiY2xpZW50WCIsImxlZnQiLCJteSIsImNsaWVudFkiLCJ0b3AiLCJhZGRXYXZlIiwiY2FudmFzT2Zmc2NyZWVuIiwidmFsIiwiTWF0aCIsIm1heCIsImluaXRpYWxUciIsImxhc3RUciIsInRpbWVTdGFtcCIsIkRhdGUiLCJub3ciLCJsaXZlIiwiYXJjIiwidnIiLCJ0cmFuc3ByZW50IiwiY29sb3IiLCJwdXNoIiwic3RhcnQiLCJzdGVwIiwicmVuZGVyIiwidXBkYXRlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2hhZG93Q29sb3IiLCJzaGFkb3dPZmZzZXRYIiwic2hhZG93Qmx1ciIsIkFycmF5IiwiZnJvbSIsIm9iaiIsInYiLCJhcnIiLCJpc1JlZmxlY3QiLCJtYXAiLCJzdHJva2VTdHlsZSIsIm9wYWNpdHkiLCJsaW5lV2lkdGgiLCJiZWdpblBhdGgiLCJQSSIsImNsb3NlUGF0aCIsInN0cm9rZSIsImZpbHRlciIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxLQUFNQSxXQUFXO0FBQ2hC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QVg7QUFDQSxhQUFPLEtBQVA7QUFDQTtBQUNELFlBQU8sSUFBUDtBQUNBLEtBbEJXLENBQVo7QUFtQkEsUUFBSSxLQUFLUCxJQUFMLENBQVVrRSxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQzNCLFVBQUtwRCxJQUFMO0FBQ0E7QUFDRDs7Ozs7O21CQXZKbUJuQixJIiwiZmlsZSI6IndhdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IF9kZWZhdWx0ID0ge1xyXG5cdHdpZHRoOiBkb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoLFxyXG5cdGhlaWdodDogZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQsXHJcblx0eDogMCxcclxuXHR5OiAwLFxyXG5cdHI6IDFcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F2ZSB7XHJcblx0Y29uc3RydWN0b3Iob3B0aW9uKSB7XHJcblx0XHRPYmplY3QuYXNzaWduKHRoaXMsIF9kZWZhdWx0LCBvcHRpb24pXHJcblx0XHR0aGlzLmlzQW5pbWF0ZSA9IGZhbHNlXHJcblx0XHR0aGlzLndhdmUgPSBbXVxyXG5cdFx0dGhpcy5mbiA9IG51bGxcclxuXHRcdHRoaXMuY2IgPSBudWxsXHJcblx0XHR0aGlzLmluaXQoKVxyXG5cdH1cclxuXHRpbml0KCkge1xyXG5cdFx0dGhpcy5jcmVhdGVDYW52YXMoKVxyXG5cdFx0dGhpcy5zZXRTaXplKClcclxuXHRcdHRoaXMuYmluZEV2ZW50KClcclxuXHR9XHJcblx0Y3JlYXRlQ2FudmFzKCkge1xyXG5cdFx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxyXG5cdFx0dGhpcy5jYW52YXMuc3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgei1pbmRleDogMjsnXHJcblx0XHR0aGlzLmN4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuXHR9XHJcblx0c2V0U2l6ZSgpIHtcclxuXHRcdHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aFxyXG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcclxuXHR9XHJcblx0ZGVzdG9yeSgpIHtcclxuXHRcdHRoaXMuY3h0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcclxuXHRcdHRoaXMuc3RvcCgpXHJcblx0fVxyXG5cdGJpbmRFdmVudCgpIHtcclxuXHRcdHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5nZXRNb3VzZVBvcy5iaW5kKHRoaXMpKVxyXG5cdH1cclxuXHRnZXRNb3VzZVBvcyhlKSB7XHJcblx0XHR0aGlzLmJvdW5kcyA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblx0ICAgIGxldCBteCA9IGUuY2xpZW50WCAtIHRoaXMuYm91bmRzLmxlZnRcclxuXHRcdGxldCBteSA9IGUuY2xpZW50WSAtIHRoaXMuYm91bmRzLnRvcFxyXG5cdFx0dGhpcy5hZGRXYXZlKG14LCBteSlcclxuXHR9XHJcblx0YWRkV2F2ZSh4LCB5KSB7XHJcblx0XHR2YXIgY2FudmFzT2Zmc2NyZWVuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcclxuXHRcdGNhbnZhc09mZnNjcmVlbi53aWR0aCA9IHRoaXMud2lkdGhcclxuXHRcdGNhbnZhc09mZnNjcmVlbi5oZWlnaHQgPSB0aGlzLmhlaWdodFxyXG5cdFx0bGV0IHZhbCA9IE1hdGgubWF4KHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxyXG5cclxuXHRcdGxldCB3YXZlID0ge1xyXG5cdFx0XHR4OiB4LFxyXG5cdFx0XHR5OiB5LFxyXG5cdFx0XHRpbml0aWFsVHI6IDEsXHJcblx0XHRcdGxhc3RUcjogLjUsXHJcblx0XHRcdHRpbWVTdGFtcDogRGF0ZS5ub3coKSxcclxuXHRcdFx0Ly8gbGl2ZTogcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIDIpICogMTAwMCArIDEwMDAwLFxyXG5cdFx0XHRsaXZlOiB2YWwgLyAxODAgKiAxMDAwLFxyXG5cdFx0XHRjYW52YXM6IGNhbnZhc09mZnNjcmVlbixcclxuXHRcdFx0Y3h0OiBjYW52YXNPZmZzY3JlZW4uZ2V0Q29udGV4dCgnMmQnKSxcclxuXHRcdFx0YXJjOiBbe1xyXG5cdFx0XHRcdHI6IDAsXHJcblx0XHRcdFx0dnI6IDMsXHJcblx0XHRcdFx0d2lkdGg6IDAuNSxcclxuXHRcdFx0XHR0cmFuc3ByZW50OiAwLjM2LFxyXG5cdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsIDI1NSwgMjU1LCdcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHI6IC01LFxyXG5cdFx0XHRcdHZyOiAzLFxyXG5cdFx0XHRcdHdpZHRoOiAzLFxyXG5cdFx0XHRcdHRyYW5zcHJlbnQ6IDAuMixcclxuXHRcdFx0XHRjb2xvcjogJ3JnYmEoMjExLCAyMTEsIDIxMSwnXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRyOiAwLFxyXG5cdFx0XHRcdHZyOiAyLjgsXHJcblx0XHRcdFx0d2lkdGg6IDEsXHJcblx0XHRcdFx0dHJhbnNwcmVudDogMC4yLFxyXG5cdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsIDI1NSwgMjU1LCdcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHI6IC0yMCxcclxuXHRcdFx0XHR2cjogMixcclxuXHRcdFx0XHR3aWR0aDogMSxcclxuXHRcdFx0XHR0cmFuc3ByZW50OiAwLjMsXHJcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsJ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0cjogLTUwLFxyXG5cdFx0XHRcdHZyOiAzLFxyXG5cdFx0XHRcdHdpZHRoOiAwLjgsXHJcblx0XHRcdFx0dHJhbnNwcmVudDogMC4yLFxyXG5cdFx0XHRcdGNvbG9yOiAncmdiYSgxNTYsIDE1NiwgMTU2LCdcclxuXHRcdFx0fV1cclxuXHRcdH1cclxuXHRcdHRoaXMud2F2ZS5wdXNoKHdhdmUpXHJcblx0XHR0aGlzLnN0YXJ0KClcclxuXHR9XHJcblx0c3RhcnQoKSB7XHJcblx0XHRpZiAodGhpcy5pc0FuaW1hdGUpIHJldHVybiBmYWxzZVxyXG5cclxuXHRcdHRoaXMuaXNBbmltYXRlID0gdHJ1ZVxyXG5cdFx0Y29uc3Qgc3RlcCA9ICgpID0+IHtcclxuXHRcdFx0aWYgKCF0aGlzLmlzQW5pbWF0ZSkgcmV0dXJuIGZhbHNlXHJcblx0XHRcdHRoaXMuZm4gJiYgdGhpcy5mbigpXHJcblx0XHRcdHRoaXMucmVuZGVyKClcclxuXHRcdFx0dGhpcy51cGRhdGUoKVxyXG5cdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuXHRcdH1cclxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG5cdH1cclxuXHRzdG9wKCkge1xyXG5cdFx0dGhpcy5pc0FuaW1hdGUgPSBmYWxzZVxyXG5cdH1cclxuXHRyZW5kZXIoKSB7XHJcblx0XHR0aGlzLmN4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXHJcblx0XHR0aGlzLmN4dC5zaGFkb3dDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNDYpJ1xyXG5cdFx0dGhpcy5jeHQuc2hhZG93T2Zmc2V0WCA9IC01XHJcblx0XHR0aGlzLmN4dC5zaGFkb3dPZmZzZXRYID0gLTVcclxuXHRcdHRoaXMuY3h0LnNoYWRvd0JsdXIgPSAxMFxyXG5cclxuXHRcdEFycmF5LmZyb20odGhpcy53YXZlLCBvYmogPT4ge1xyXG5cdFx0XHRBcnJheS5mcm9tKG9iai5hcmMsIHYgPT4ge1xyXG5cdFx0XHRcdGlmICh2LnIgPCAwKSByZXR1cm4gZmFsc2VcclxuXHJcblx0XHRcdFx0bGV0IGFyciA9IFt7IHg6IG9iai54LCB5OiBvYmoueSwgaXNSZWZsZWN0OiBmYWxzZSB9LCB7IHg6IC1vYmoueCwgeTogb2JqLnksIGlzUmVmbGVjdDogdHJ1ZSB9LCB7IHg6IG9iai54LCB5OiAtb2JqLnksIGlzUmVmbGVjdDogdHJ1ZSB9LCB7IHg6IHRoaXMud2lkdGggKiAyIC0gb2JqLngsIHk6IG9iai55LCBpc1JlZmxlY3Q6IHRydWUgfSwgeyB4OiBvYmoueCwgeTogdGhpcy5oZWlnaHQgKiAyIC0gb2JqLnksIGlzUmVmbGVjdDogdHJ1ZSB9XVxyXG5cdFx0XHRcdGFyci5tYXAoKHsgeCwgeSwgaXNSZWZsZWN0IH0pID0+IHtcclxuXHRcdFx0XHRcdHRoaXMuY3h0LnN0cm9rZVN0eWxlID0gdi5jb2xvciArICh2Lm9wYWNpdHkgKiAoaXNSZWZsZWN0ID8gMC42IDogMSkpICsgJyknXHJcblx0XHRcdFx0XHR0aGlzLmN4dC5saW5lV2lkdGggPSB2LndpZHRoICogKGlzUmVmbGVjdCA/IDAuNiA6IDEpXHJcblx0XHRcdFx0XHR0aGlzLmN4dC5iZWdpblBhdGgoKVxyXG5cdFx0XHRcdFx0dGhpcy5jeHQuYXJjKHgsIHksIHYuciwgMCwgMiAqIE1hdGguUEksIHRydWUpXHJcblx0XHRcdFx0XHR0aGlzLmN4dC5jbG9zZVBhdGgoKVxyXG5cclxuXHRcdFx0XHRcdHRoaXMuY3h0LnN0cm9rZSgpXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdH0pXHJcblx0fVxyXG5cdHVwZGF0ZSgpIHtcclxuXHRcdGxldCBub3cgPSBEYXRlLm5vdygpXHJcblx0XHR0aGlzLndhdmUgPSB0aGlzLndhdmUuZmlsdGVyKG9iaiA9PiB7XHJcblx0XHRcdG9iai5hcmMgPSBvYmouYXJjLmZpbHRlcih2ID0+IHtcclxuXHRcdFx0XHRpZiAobm93IC0gb2JqLnRpbWVTdGFtcCA+IG9iai5saXZlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR2Lm9wYWNpdHkgPSAoMSAtIChub3cgLSBvYmoudGltZVN0YW1wKSAvIG9iai5saXZlKSAqIHYudHJhbnNwcmVudFxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0di5yICs9IHYudnJcclxuXHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0fSlcclxuXHRcdFx0aWYgKG9iai5hcmMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5jYiAmJiB0aGlzLmNiKG9iai5jYW52YXMpXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdH0pXHJcblx0XHRpZiAodGhpcy53YXZlLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHR0aGlzLnN0b3AoKVxyXG5cdFx0fVxyXG5cdH1cclxufSJdfQ==
