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
					initialTr: 1,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdmUuanMiXSwibmFtZXMiOlsiX2RlZmF1bHQiLCJ3aWR0aCIsImRvY3VtZW50IiwiYm9keSIsIm9mZnNldFdpZHRoIiwiaGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwieCIsInkiLCJyIiwiV2F2ZSIsIm9wdGlvbiIsIk9iamVjdCIsImFzc2lnbiIsImlzQW5pbWF0ZSIsIndhdmUiLCJmbiIsImNiIiwiaW5pdCIsImNyZWF0ZUNhbnZhcyIsInNldFNpemUiLCJiaW5kRXZlbnQiLCJjYW52YXMiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJjc3NUZXh0IiwiYm91bmRzIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY3h0IiwiZ2V0Q29udGV4dCIsImNsZWFyUmVjdCIsInN0b3AiLCJhZGRFdmVudExpc3RlbmVyIiwiZ2V0TW91c2VQb3MiLCJiaW5kIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIm14IiwiY2xpZW50WCIsImxlZnQiLCJteSIsImNsaWVudFkiLCJ0b3AiLCJhZGRXYXZlIiwiY2FudmFzT2Zmc2NyZWVuIiwiaW5pdGlhbFRyIiwibWFpbiIsImxhc3RUciIsInRpbWVTdGFtcCIsIkRhdGUiLCJub3ciLCJsaXZlIiwiYXJjIiwidnIiLCJ0cmFuc3ByZW50IiwiY29sb3IiLCJwdXNoIiwic3RhcnQiLCJzdGVwIiwicmVuZGVyIiwidXBkYXRlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2hhZG93Q29sb3IiLCJzaGFkb3dPZmZzZXRYIiwic2hhZG93Qmx1ciIsIkFycmF5IiwiZnJvbSIsIm9iaiIsInYiLCJhcnIiLCJpc1JlZmxlY3QiLCJtYXAiLCJzdHJva2VTdHlsZSIsIm9wYWNpdHkiLCJsaW5lV2lkdGgiLCJiZWdpblBhdGgiLCJNYXRoIiwiUEkiLCJjbG9zZVBhdGgiLCJzdHJva2UiLCJmaWx0ZXIiLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsS0FB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LEtBQUtsRSxJQUFMLENBQVVrRSxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQzNCLFVBQUtsRCxJQUFMO0FBQ0E7QUFDRDs7Ozs7O21CQXpKbUJyQixJIiwiZmlsZSI6IndhdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IF9kZWZhdWx0ID0ge1xyXG5cdHdpZHRoOiBkb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoLFxyXG5cdGhlaWdodDogZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQsXHJcblx0eDogMCxcclxuXHR5OiAwLFxyXG5cdHI6IDFcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F2ZSB7XHJcblx0Y29uc3RydWN0b3Iob3B0aW9uKSB7XHJcblx0XHRPYmplY3QuYXNzaWduKHRoaXMsIF9kZWZhdWx0LCBvcHRpb24pXHJcblx0XHR0aGlzLmlzQW5pbWF0ZSA9IGZhbHNlXHJcblx0XHR0aGlzLndhdmUgPSBbXVxyXG5cdFx0dGhpcy5mbiA9IG51bGxcclxuXHRcdHRoaXMuY2IgPSBudWxsXHJcblx0XHR0aGlzLmluaXQoKVxyXG5cdH1cclxuXHRpbml0KCkge1xyXG5cdFx0dGhpcy5jcmVhdGVDYW52YXMoKVxyXG5cdFx0dGhpcy5zZXRTaXplKClcclxuXHRcdHRoaXMuYmluZEV2ZW50KClcclxuXHR9XHJcblx0Y3JlYXRlQ2FudmFzKCkge1xyXG5cdFx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxyXG5cdFx0dGhpcy5jYW52YXMuc3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgei1pbmRleDogMjsnXHJcblx0XHR0aGlzLmJvdW5kcyA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblx0XHR0aGlzLmN4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuXHR9XHJcblx0c2V0U2l6ZSgpIHtcclxuXHRcdHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aFxyXG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcclxuXHR9XHJcblx0ZGVzdG9yeSgpIHtcclxuXHRcdHRoaXMuY3h0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcclxuXHRcdHRoaXMuc3RvcCgpXHJcblx0fVxyXG5cdGJpbmRFdmVudCgpIHtcclxuXHRcdHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5nZXRNb3VzZVBvcy5iaW5kKHRoaXMpKVxyXG5cdH1cclxuXHRnZXRNb3VzZVBvcyhlKSB7XHJcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpXHJcblx0ICAgIGxldCBteCA9IGUuY2xpZW50WCAtIHRoaXMuYm91bmRzLmxlZnRcclxuXHRcdGxldCBteSA9IGUuY2xpZW50WSAtIHRoaXMuYm91bmRzLnRvcFxyXG5cdFx0dGhpcy5hZGRXYXZlKG14LCBteSlcclxuXHR9XHJcblx0YWRkV2F2ZSh4LCB5KSB7XHJcblx0XHR2YXIgY2FudmFzT2Zmc2NyZWVuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcclxuXHRcdGNhbnZhc09mZnNjcmVlbi53aWR0aCA9IHRoaXMud2lkdGhcclxuXHRcdGNhbnZhc09mZnNjcmVlbi5oZWlnaHQgPSB0aGlzLmhlaWdodFxyXG5cdFx0Ly8gbGV0IHZhbCA9IE1hdGgubWF4KHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxyXG5cclxuXHRcdGxldCB3YXZlID0ge1xyXG5cdFx0XHR4OiB4LFxyXG5cdFx0XHR5OiB5LFxyXG5cdFx0XHRpbml0aWFsVHI6IDEsXHJcblx0XHRcdG1haW46IHggPCB0aGlzLndpZHRoIC8gMixcclxuXHRcdFx0bGFzdFRyOiAwLFxyXG5cdFx0XHR0aW1lU3RhbXA6IERhdGUubm93KCksXHJcblx0XHRcdGxpdmU6IDIwMDAsXHJcblx0XHRcdC8vIGxpdmU6IHZhbCAvIDE4MCAqIDEwMDAsXHJcblx0XHRcdGNhbnZhczogY2FudmFzT2Zmc2NyZWVuLFxyXG5cdFx0XHRjeHQ6IGNhbnZhc09mZnNjcmVlbi5nZXRDb250ZXh0KCcyZCcpLFxyXG5cdFx0XHRhcmM6IFt7XHJcblx0XHRcdFx0cjogMCxcclxuXHRcdFx0XHR2cjogNSxcclxuXHRcdFx0XHR3aWR0aDogMC41LFxyXG5cdFx0XHRcdHRyYW5zcHJlbnQ6IDAuMzYsXHJcblx0XHRcdFx0Y29sb3I6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsJ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0cjogLTIwLFxyXG5cdFx0XHRcdHZyOiA1LFxyXG5cdFx0XHRcdHdpZHRoOiAzLFxyXG5cdFx0XHRcdHRyYW5zcHJlbnQ6IDAuMixcclxuXHRcdFx0XHRjb2xvcjogJ3JnYmEoMjExLCAyMTEsIDIxMSwnXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRyOiAtNTAsXHJcblx0XHRcdFx0dnI6IDMsXHJcblx0XHRcdFx0d2lkdGg6IDEsXHJcblx0XHRcdFx0dHJhbnNwcmVudDogMC4yLFxyXG5cdFx0XHRcdGNvbG9yOiAncmdiYSgyNTUsIDI1NSwgMjU1LCdcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHI6IC01MCxcclxuXHRcdFx0XHR2cjogMi44LFxyXG5cdFx0XHRcdHdpZHRoOiAwLjgsXHJcblx0XHRcdFx0dHJhbnNwcmVudDogMC4xLFxyXG5cdFx0XHRcdGNvbG9yOiAncmdiYSgxNTYsIDE1NiwgMTU2LCdcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHI6IC01MCxcclxuXHRcdFx0XHR2cjogMyxcclxuXHRcdFx0XHR3aWR0aDogMC44LFxyXG5cdFx0XHRcdHRyYW5zcHJlbnQ6IDAuMixcclxuXHRcdFx0XHRjb2xvcjogJ3JnYmEoMTU2LCAxNTYsIDE1NiwnXHJcblx0XHRcdH1dXHJcblx0XHR9XHJcblx0XHR0aGlzLndhdmUucHVzaCh3YXZlKVxyXG5cdFx0dGhpcy5zdGFydCgpXHJcblx0fVxyXG5cdHN0YXJ0KCkge1xyXG5cdFx0aWYgKHRoaXMuaXNBbmltYXRlKSByZXR1cm4gZmFsc2VcclxuXHJcblx0XHR0aGlzLmlzQW5pbWF0ZSA9IHRydWVcclxuXHRcdGNvbnN0IHN0ZXAgPSAoKSA9PiB7XHJcblx0XHRcdGlmICghdGhpcy5pc0FuaW1hdGUpIHJldHVybiBmYWxzZVxyXG5cdFx0XHR0aGlzLmZuICYmIHRoaXMuZm4oKVxyXG5cdFx0XHR0aGlzLnJlbmRlcigpXHJcblx0XHRcdHRoaXMudXBkYXRlKClcclxuXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcblx0XHR9XHJcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuXHR9XHJcblx0c3RvcCgpIHtcclxuXHRcdHRoaXMuaXNBbmltYXRlID0gZmFsc2VcclxuXHR9XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0dGhpcy5jeHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxyXG5cdFx0dGhpcy5jeHQuc2hhZG93Q29sb3IgPSAncmdiYSgwLCAwLCAwLCAwLjQ2KSdcclxuXHRcdHRoaXMuY3h0LnNoYWRvd09mZnNldFggPSAtNVxyXG5cdFx0dGhpcy5jeHQuc2hhZG93T2Zmc2V0WCA9IC01XHJcblx0XHR0aGlzLmN4dC5zaGFkb3dCbHVyID0gMTBcclxuXHJcblx0XHRBcnJheS5mcm9tKHRoaXMud2F2ZSwgb2JqID0+IHtcclxuXHRcdFx0QXJyYXkuZnJvbShvYmouYXJjLCB2ID0+IHtcclxuXHRcdFx0XHRpZiAodi5yIDwgMCkgcmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0XHRcdGxldCBhcnIgPSBbeyB4OiBvYmoueCwgeTogb2JqLnksIGlzUmVmbGVjdDogZmFsc2UgfSwgeyB4OiAtb2JqLngsIHk6IG9iai55LCBpc1JlZmxlY3Q6IHRydWUgfSwgeyB4OiBvYmoueCwgeTogLW9iai55LCBpc1JlZmxlY3Q6IHRydWUgfSwgeyB4OiB0aGlzLndpZHRoICogMiAtIG9iai54LCB5OiBvYmoueSwgaXNSZWZsZWN0OiB0cnVlIH0sIHsgeDogb2JqLngsIHk6IHRoaXMuaGVpZ2h0ICogMiAtIG9iai55LCBpc1JlZmxlY3Q6IHRydWUgfV1cclxuXHRcdFx0XHRhcnIubWFwKCh7IHgsIHksIGlzUmVmbGVjdCB9KSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmN4dC5zdHJva2VTdHlsZSA9IHYuY29sb3IgKyAodi5vcGFjaXR5ICogKGlzUmVmbGVjdCA/IDAuOCA6IDEpKSArICcpJ1xyXG5cdFx0XHRcdFx0dGhpcy5jeHQubGluZVdpZHRoID0gdi53aWR0aCAqIChpc1JlZmxlY3QgPyAwLjggOiAxKVxyXG5cdFx0XHRcdFx0dGhpcy5jeHQuYmVnaW5QYXRoKClcclxuXHRcdFx0XHRcdHRoaXMuY3h0LmFyYyh4LCB5LCB2LnIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKVxyXG5cdFx0XHRcdFx0dGhpcy5jeHQuY2xvc2VQYXRoKClcclxuXHJcblx0XHRcdFx0XHR0aGlzLmN4dC5zdHJva2UoKVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pXHJcblx0XHR9KVxyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblx0XHRsZXQgbm93ID0gRGF0ZS5ub3coKVxyXG5cdFx0dGhpcy53YXZlID0gdGhpcy53YXZlLmZpbHRlcihvYmogPT4ge1xyXG5cdFx0XHRvYmouYXJjID0gb2JqLmFyYy5maWx0ZXIodiA9PiB7XHJcblx0XHRcdFx0aWYgKG5vdyAtIG9iai50aW1lU3RhbXAgPiBvYmoubGl2ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0di5vcGFjaXR5ID0gKDEgLSAobm93IC0gb2JqLnRpbWVTdGFtcCkgLyBvYmoubGl2ZSkgKiB2LnRyYW5zcHJlbnRcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHYuciArPSB2LnZyXHJcblxyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdH0pXHJcblx0XHRcdGlmIChvYmouYXJjLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdC8vIHRoaXMuY2IgJiYgdGhpcy5jYihvYmouY2FudmFzKVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0cnVlXHJcblx0XHR9KVxyXG5cdFx0aWYgKHRoaXMud2F2ZS5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0dGhpcy5zdG9wKClcclxuXHRcdH1cclxuXHR9XHJcbn0iXX0=
