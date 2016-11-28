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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbnZhcy5qcyJdLCJuYW1lcyI6WyJfZGVmYXVsdCIsIndpZHRoIiwiZG9jdW1lbnQiLCJib2R5Iiwib2Zmc2V0V2lkdGgiLCJoZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJ4IiwieSIsInIiLCJDYW52YXMiLCJlbCIsIm9wdGlvbiIsIk9iamVjdCIsImFzc2lnbiIsImNhbnZhcyIsInBhcnRpY2xlcyIsImN4dCIsImdldENvbnRleHQiLCJpc0FuaW1hdGUiLCJpbml0Iiwic2V0U2l6ZSIsImNyZWF0ZU1hc2siLCJjcmVhdGVDb2xvckNhbnZhcyIsImJvdW5kcyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIndyYXAiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJwb3NpdGlvbiIsIm1hc2siLCJmbiIsInVwZGF0ZUNvbG9ycyIsImJpbmQiLCJwYXJlbnROb2RlIiwiYXBwZW5kQ2hpbGQiLCJjb2xvckNhbnZhcyIsImNzc1RleHQiLCJjb2xvckNhbnZhc0N4dCIsImNsZWFyUmVjdCIsInN0b3AiLCJlIiwibXgiLCJjbGllbnRYIiwibGVmdCIsIm15IiwiY2xpZW50WSIsInRvcCIsInVwZGF0ZSIsInN0ZXAiLCJyZW5kZXIiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJBcnJheSIsImZyb20iLCJwYXJ0aWNsZSIsImZpbGxTdHlsZSIsImdyYXlDb2xvciIsImJlZ2luUGF0aCIsImFyYyIsIk1hdGgiLCJQSSIsImNsb3NlUGF0aCIsImZpbGwiLCJkcmF3SW1hZ2UiLCJ3YXZlIiwibGVuZ3RoIiwibm93IiwiRGF0ZSIsIm9iaiIsInYiLCJ0ciIsInRpbWVTdGFtcCIsImxpdmUiLCJpbml0aWFsVHIiLCJsYXN0VHIiLCJnbG9iYWxBbHBoYSIsImNsaXAiLCJtYWluIiwiY29sb3JfaW1nIiwiaW1nX3dpZHRoIiwiaW1nX2hlaWdodCIsImltZyIsInNyYyIsInR5cGUiLCJJbWFnZSIsIm9ubG9hZCIsInNldEdyYXlJbWFnZSIsImdldEltYWdlRGF0YSIsImFyciIsImdyYXlBcnIiLCJzX3dpZHRoIiwic19oZWlnaHQiLCJwb3MiLCJpIiwiaiIsIm94Iiwib3kiLCJ2eCIsInZ5IiwiY29sb3IiLCJqb2luIiwicHVzaCIsImltYWdlRGF0YSIsImRhdGEiLCJsZW4iLCJncmF5IiwicGFyc2VJbnQiLCJwdXRJbWFnZURhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxLQUFNQSxXQUFXO0FBQ2hCQyxTQUFPQyxTQUFTQyxJQUFULENBQWNDLFdBREwsRUFDa0I7QUFDbENDLFVBQVFILFNBQVNDLElBQVQsQ0FBY0csWUFGTixFQUVvQjtBQUNwQ0MsS0FBRyxDQUhhO0FBSWhCQyxLQUFHLENBSmE7QUFLaEJDLEtBQUc7QUFMYSxFQUFqQjs7S0FVcUJDLE07QUFDcEIsa0JBQVlDLEVBQVosRUFBZ0JDLE1BQWhCLEVBQXdCO0FBQUE7O0FBQ3ZCQyxVQUFPQyxNQUFQLENBQWMsSUFBZCxFQUFvQmQsUUFBcEIsRUFBOEJZLE1BQTlCO0FBQ0EsUUFBS0csTUFBTCxHQUFjSixFQUFkO0FBQ0EsUUFBS0ssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFFBQUtDLEdBQUwsR0FBVyxLQUFLRixNQUFMLENBQVlHLFVBQVosQ0FBdUIsSUFBdkIsQ0FBWDtBQUNBLFFBQUtDLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxRQUFLQyxJQUFMO0FBQ0E7Ozs7MEJBQ007QUFDTixTQUFLQyxPQUFMLENBQWEsS0FBS04sTUFBbEI7QUFDQSxTQUFLTyxVQUFMO0FBQ0EsU0FBS0MsaUJBQUw7QUFDQSxTQUFLQyxNQUFMLEdBQWMsS0FBS1QsTUFBTCxDQUFZVSxxQkFBWixFQUFkO0FBQ0E7OztnQ0FDWTtBQUNaLFNBQUtDLElBQUwsR0FBWXhCLFNBQVN5QixhQUFULENBQXVCLE1BQXZCLENBQVo7QUFDQSxTQUFLRCxJQUFMLENBQVVFLEtBQVYsQ0FBZ0JDLFFBQWhCLEdBQTJCLFVBQTNCO0FBQ0EsU0FBS0MsSUFBTCxHQUFZ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LFNBQUt4RixHQUFMLENBQVMwRixZQUFULENBQXNCTCxTQUF0QixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQztBQUNBOzs7Ozs7bUJBN0xtQjVGLE0iLCJmaWxlIjoiY2FudmFzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXHJcblxyXG5jb25zdCBfZGVmYXVsdCA9IHtcclxuXHR3aWR0aDogZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aCwgLy9jYW52YXPnmoTlrr3luqbvvIzpu5jorqTnqpflj6Plrr3luqZcclxuXHRoZWlnaHQ6IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0LCAvL2NhbnZhc+eahOmrmOW6pu+8jOm7mOiupOeql+WPo+mrmOW6plxyXG5cdHg6IDAsXHJcblx0eTogMCxcclxuXHRyOiAxXHJcbn1cclxuXHJcbmltcG9ydCBXYXZlIGZyb20gJ3dhdmUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzIHtcclxuXHRjb25zdHJ1Y3RvcihlbCwgb3B0aW9uKSB7XHJcblx0XHRPYmplY3QuYXNzaWduKHRoaXMsIF9kZWZhdWx0LCBvcHRpb24pXHJcblx0XHR0aGlzLmNhbnZhcyA9IGVsXHJcblx0XHR0aGlzLnBhcnRpY2xlcyA9IFtdXHJcblx0XHR0aGlzLmN4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuXHRcdHRoaXMuaXNBbmltYXRlID0gZmFsc2VcclxuXHRcdHRoaXMuaW5pdCgpXHJcblx0fVxyXG5cdGluaXQoKSB7XHJcblx0XHR0aGlzLnNldFNpemUodGhpcy5jYW52YXMpXHJcblx0XHR0aGlzLmNyZWF0ZU1hc2soKVxyXG5cdFx0dGhpcy5jcmVhdGVDb2xvckNhbnZhcygpXHJcblx0XHR0aGlzLmJvdW5kcyA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblx0fVxyXG5cdGNyZWF0ZU1hc2soKSB7XHJcblx0XHR0aGlzLndyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuXHRcdHRoaXMud3JhcC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcclxuXHRcdHRoaXMubWFzayA9IG5ldyBXYXZlKHtcclxuXHRcdFx0d2lkdGg6IHRoaXMud2lkdGgsXHJcblx0XHRcdGhlaWdodDogdGhpcy5oZWlnaHRcclxuXHRcdH0pXHJcblxyXG5cdFx0dGhpcy5tYXNrLmZuID0gdGhpcy51cGRhdGVDb2xvcnMuYmluZCh0aGlzKVxyXG5cdFx0Ly8gdGhpcy5tYXNrLmNiID0gdGhpcy5yZW5kZXJDb2xvcnMuYmluZCh0aGlzKVxyXG5cclxuXHRcdGxldCBwYXJlbnROb2RlID0gdGhpcy5jYW52YXMucGFyZW50Tm9kZVxyXG5cdFx0dGhpcy53cmFwLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKVxyXG5cdFx0dGhpcy53cmFwLmFwcGVuZENoaWxkKHRoaXMubWFzay5jYW52YXMpXHJcblx0XHRwYXJlbnROb2RlLmFwcGVuZENoaWxkKHRoaXMud3JhcClcclxuXHR9XHJcblx0Y3JlYXRlQ29sb3JDYW52YXMoKSB7XHJcblx0XHR0aGlzLmNvbG9yQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcclxuXHRcdHRoaXMuc2V0U2l6ZSh0aGlzLmNvbG9yQ2FudmFzKVxyXG5cdFx0dGhpcy5jb2xvckNhbnZhcy5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyB6LWluZGV4OiAxOydcclxuXHRcdHRoaXMuY29sb3JDYW52YXNDeHQgPSB0aGlzLmNvbG9yQ2FudmFzLmdldENvbnRleHQoJzJkJylcclxuXHRcdHRoaXMud3JhcC5hcHBlbmRDaGlsZCh0aGlzLmNvbG9yQ2FudmFzKVxyXG5cdH1cclxuXHRkZXN0b3J5KCkge1xyXG5cdFx0dGhpcy5jeHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxyXG5cdFx0dGhpcy5zdG9wKClcclxuXHR9XHJcblx0Z2V0TW91c2VQb3MoZSkge1xyXG5cdCAgICB0aGlzLm14ID0gZS5jbGllbnRYIC0gdGhpcy5ib3VuZHMubGVmdFxyXG5cdFx0dGhpcy5teSA9IGUuY2xpZW50WSAtIHRoaXMuYm91bmRzLnRvcFxyXG5cdFx0dGhpcy51cGRhdGUoKVxyXG5cdH1cclxuXHRzZXRTaXplKGVsKSB7XHJcblx0XHRlbC53aWR0aCA9IHRoaXMud2lkdGhcclxuXHRcdGVsLmhlaWdodCA9IHRoaXMuaGVpZ2h0XHJcblx0fVxyXG5cdHN0YXJ0KCkge1xyXG5cdFx0aWYgKHRoaXMuaXNBbmltYXRlKSByZXR1cm4gZmFsc2VcclxuXHJcblx0XHR0aGlzLmlzQW5pbWF0ZSA9IHRydWVcclxuXHRcdGNvbnN0IHN0ZXAgPSAoKSA9PiB7XHJcblx0XHRcdGlmICghdGhpcy5pc0FuaW1hdGUpIHJldHVybiBmYWxzZVxyXG5cdFx0XHR0aGlzLnJlbmRlcigpXHJcblx0XHRcdHRoaXMudXBkYXRlKClcclxuXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcblx0XHR9XHJcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuXHR9XHJcblx0c3RvcCgpIHtcclxuXHRcdHRoaXMuaXNBbmltYXRlID0gZmFsc2VcclxuXHR9XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0dGhpcy5jeHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxyXG5cclxuXHRcdEFycmF5LmZyb20odGhpcy5wYXJ0aWNsZXMsIChwYXJ0aWNsZSkgPT4ge1xyXG5cdFx0XHR0aGlzLmN4dC5maWxsU3R5bGUgPSAncmdiYSgnICsgcGFydGljbGUuZ3JheUNvbG9yICsgJyknXHJcblxyXG5cdFx0XHR0aGlzLmN4dC5iZWdpblBhdGgoKVxyXG5cdFx0XHR0aGlzLmN4dC5hcmMocGFydGljbGUueCwgcGFydGljbGUueSwgdGhpcy5yLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSlcclxuXHRcdFx0dGhpcy5jeHQuY2xvc2VQYXRoKClcclxuXHJcblx0XHRcdHRoaXMuY3h0LmZpbGwoKVxyXG5cdFx0fSlcclxuXHR9XHJcblx0cmVuZGVyQ29sb3JzKGNhbnZhcykge1xyXG5cdFx0dGhpcy5jeHQuZHJhd0ltYWdlKGNhbnZhcywgdGhpcy54LCB0aGlzLnkpXHJcblx0fVxyXG5cdHVwZGF0ZUNvbG9ycygpIHtcclxuXHRcdGlmICh0aGlzLm1hc2sud2F2ZS5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZVxyXG5cdFx0Ly8g56a75bGP5riy5p+TXHJcblx0XHRsZXQgbm93ID0gRGF0ZS5ub3coKVxyXG5cdFx0dGhpcy5jb2xvckNhbnZhc0N4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXHJcblx0XHRBcnJheS5mcm9tKHRoaXMubWFzay53YXZlLCBvYmogPT4ge1xyXG5cdFx0XHRvYmouY2FudmFzLndpZHRoID0gdGhpcy53aWR0aFxyXG5cdFx0XHRvYmouY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0XHJcblx0XHRcdGxldCBjeHQgPSBvYmouY3h0XHJcblx0XHRcdGN4dC5iZWdpblBhdGgoKVxyXG5cdFx0XHRsZXQgdiA9IG9iai5hcmNbMF1cclxuXHRcdFx0bGV0IHRyID0gKDEgLSAobm93IC0gb2JqLnRpbWVTdGFtcCkgLyBvYmoubGl2ZSkgKiAob2JqLmluaXRpYWxUciAtIG9iai5sYXN0VHIpICsgb2JqLmxhc3RUclxyXG5cdFx0XHRjeHQuZ2xvYmFsQWxwaGEgPSB0ciA8IDAgPyAwIDogdHJcclxuXHRcdFx0Ly8gY3h0Lmdsb2JhbEFscGhhID0gdi5vcGFjaXR5XHJcblx0XHRcdGN4dC5hcmMob2JqLngsIG9iai55LCB2LnIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKVxyXG5cdFx0XHRjeHQuY2xvc2VQYXRoKClcclxuXHRcdFx0Y3h0LmNsaXAoKVxyXG5cdFx0XHRpZiAob2JqLm1haW4pIHtcclxuXHRcdFx0XHR0aGlzLmNvbG9yX2ltZyAmJiBjeHQuZHJhd0ltYWdlKHRoaXMuY29sb3JfaW1nLCB0aGlzLngsIHRoaXMueSwgdGhpcy5pbWdfd2lkdGgsIHRoaXMuaW1nX2hlaWdodClcclxuXHRcdFx0XHRjeHQuZHJhd0ltYWdlKHRoaXMuaW1nICwgdGhpcy54LCB0aGlzLnksIHRoaXMuaW1nX3dpZHRoLCB0aGlzLmltZ19oZWlnaHQpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Y3h0LmRyYXdJbWFnZSh0aGlzLmltZyAsIHRoaXMueCwgdGhpcy55LCB0aGlzLmltZ193aWR0aCwgdGhpcy5pbWdfaGVpZ2h0KVxyXG5cdFx0XHRcdHRoaXMuY29sb3JfaW1nICYmIGN4dC5kcmF3SW1hZ2UodGhpcy5jb2xvcl9pbWcsIHRoaXMueCwgdGhpcy55LCB0aGlzLmltZ193aWR0aCwgdGhpcy5pbWdfaGVpZ2h0KVxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuY29sb3JDYW52YXNDeHQuZHJhd0ltYWdlKG9iai5jYW52YXMsIHRoaXMueCwgdGhpcy55KVxyXG5cdFx0fSlcclxuXHR9XHJcblx0c2V0SW1hZ2Uoc3JjLCB0eXBlKSB7XHJcblx0XHRsZXQgaW1nID0gbmV3IEltYWdlKClcclxuXHRcdGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcblx0XHRcdGlmICh0eXBlID09PSAnY29sb3JzJykge1xyXG5cdFx0XHRcdHRoaXMuY29sb3JfaW1nID0gaW1nXHJcblx0XHRcdFx0dGhpcy5jb2xvcl9pbWcud2lkdGggPSB0aGlzLndpZHRoXHJcblx0XHRcdFx0dGhpcy5jb2xvcl9pbWcuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmltZyA9IGltZ1xyXG5cdFx0XHRcdHRoaXMuaW1nX3dpZHRoID0gdGhpcy5pbWcud2lkdGggPSB0aGlzLndpZHRoXHJcblx0XHRcdFx0dGhpcy5pbWdfaGVpZ2h0ID0gdGhpcy5pbWcuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcclxuXHRcdFx0XHR0aGlzLmN4dC5kcmF3SW1hZ2UodGhpcy5pbWcsIHRoaXMueCwgdGhpcy55LCB0aGlzLmltZ193aWR0aCwgdGhpcy5pbWdfaGVpZ2h0KVxyXG5cdFx0XHRcdHRoaXMuc2V0R3JheUltYWdlKClcclxuXHRcdFx0XHQvKiDlm77niYfnspLlrZDljJYsIOebruWJjeacqueUqOWIsCAqL1xyXG5cdFx0XHRcdC8vIHRoaXMuZ2V0UGFydGljbGUoKVxyXG5cdFx0XHRcdC8vIHRoaXMucmVuZGVyKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aW1nLnNyYyA9IHNyY1xyXG5cdH1cclxuXHRnZXRQYXJ0aWNsZSgpIHtcclxuXHRcdHRoaXMucGFydGljbGVzID0gW11cclxuXHRcdGxldCB7IGFyciwgZ3JheUFyciB9ID0gdGhpcy5nZXRJbWFnZURhdGEoKVxyXG5cdFx0bGV0IHNfd2lkdGggPSAxXHJcblx0XHRsZXQgc19oZWlnaHQgPSAxXHJcblx0XHRsZXQgcG9zID0gMFxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmltZ193aWR0aDsgaSsrKSB7XHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5pbWdfaGVpZ2h0OyBqKyspIHtcclxuXHRcdFx0XHRwb3MgPSAoaiAqIHNfaGVpZ2h0KSAqICh0aGlzLmltZ193aWR0aCkgKyAoaSAqIHNfd2lkdGgpXHJcblx0XHRcdFx0bGV0IHggPSB0aGlzLnggKyBpICogc193aWR0aFxyXG5cdFx0XHRcdGxldCB5ID0gdGhpcy55ICsgaiAqIHNfaGVpZ2h0XHJcblx0XHRcdFx0bGV0IHBhcnRpY2xlID0ge1xyXG5cdFx0XHRcdFx0eDogeCxcclxuXHRcdFx0XHRcdHk6IHksXHJcblx0XHRcdFx0XHRveDogeCxcclxuXHRcdFx0XHRcdG95OiB5LFxyXG5cdFx0XHRcdFx0dng6IDAsXHJcblx0XHRcdFx0XHR2eTogMCxcclxuXHRcdFx0XHRcdGNvbG9yOiBhcnJbcG9zXS5qb2luKCcsJyksXHJcblx0XHRcdFx0XHRncmF5Q29sb3I6IGdyYXlBcnJbcG9zXS5qb2luKCcsJylcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5wYXJ0aWNsZXMucHVzaChwYXJ0aWNsZSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRnZXRJbWFnZURhdGEoKSB7XHJcblx0XHRsZXQgaW1hZ2VEYXRhID0gdGhpcy5jeHQuZ2V0SW1hZ2VEYXRhKHRoaXMueCwgdGhpcy55LCB0aGlzLmltZ193aWR0aCwgdGhpcy5pbWdfaGVpZ2h0KVxyXG5cdFx0bGV0IGRhdGEgPSBpbWFnZURhdGEuZGF0YVxyXG5cdFx0bGV0IGxlbiA9IGltYWdlRGF0YS5kYXRhLmxlbmd0aFxyXG5cdFx0bGV0IGFyciA9IFtdXHJcblx0XHRsZXQgZ3JheUFyciA9IFtdXHJcblx0XHQvL+i/t+S5i+S4jeebuOetie+8n1xyXG5cdFx0aWYgKGltYWdlRGF0YS53aWR0aCAhPT0gdGhpcy5pbWdfd2lkdGgpIHRoaXMuaW1nX3dpZHRoID0gaW1hZ2VEYXRhLndpZHRoXHJcblx0XHRpZiAoaW1hZ2VEYXRhLmhlaWdodCAhPT0gdGhpcy5pbWdfaGVpZ2h0KSB0aGlzLmltZ19oZWlnaHQgPSBpbWFnZURhdGEuaGVpZ2h0XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbiAvIDQ7IGkrKykge1xyXG5cdFx0XHRsZXQgZ3JheSA9IHBhcnNlSW50KChkYXRhW2kgKiA0XSArIGRhdGFbaSAqIDQgKyAxXSArIGRhdGFbaSAqIDQgKyAyXSkgLyAzKVxyXG5cdFx0XHRhcnIucHVzaChbZGF0YVtpICogNF0sIGRhdGFbaSAqIDQgKyAxXSwgZGF0YVtpICogNCArIDJdLCBkYXRhW2kgKiA0ICsgM11dKVxyXG5cdFx0XHRncmF5QXJyLnB1c2goW2dyYXksIGdyYXksIGdyYXksIDFdKVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0YXJyLFxyXG5cdFx0XHRncmF5QXJyXHJcblx0XHR9XHJcblx0fVxyXG5cdHNldEdyYXlJbWFnZSgpIHtcclxuXHRcdGxldCBpbWFnZURhdGEgPSB0aGlzLmN4dC5nZXRJbWFnZURhdGEodGhpcy54LCB0aGlzLnksIHRoaXMuaW1nX3dpZHRoLCB0aGlzLmltZ19oZWlnaHQpXHJcblx0XHRsZXQgZGF0YSA9IGltYWdlRGF0YS5kYXRhXHJcblx0XHRsZXQgbGVuID0gaW1hZ2VEYXRhLmRhdGEubGVuZ3RoXHJcblx0XHRsZXQgYXJyID0gW11cclxuXHRcdGxldCBncmF5QXJyID0gW11cclxuXHRcdC8v6L+35LmL5LiN55u4562J77yfXHJcblx0XHRpZiAoaW1hZ2VEYXRhLndpZHRoICE9PSB0aGlzLmltZ193aWR0aCkgdGhpcy5pbWdfd2lkdGggPSBpbWFnZURhdGEud2lkdGhcclxuXHRcdGlmIChpbWFnZURhdGEuaGVpZ2h0ICE9PSB0aGlzLmltZ19oZWlnaHQpIHRoaXMuaW1nX2hlaWdodCA9IGltYWdlRGF0YS5oZWlnaHRcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuIC8gNDsgaSsrKSB7XHJcblx0XHRcdGxldCBncmF5ID0gcGFyc2VJbnQoKGRhdGFbaSAqIDRdICsgZGF0YVtpICogNCArIDFdICsgZGF0YVtpICogNCArIDJdKSAvIDMpXHJcblx0XHRcdGRhdGFbaSAqIDRdID0gZGF0YVtpICogNCArIDFdID0gZGF0YVtpICogNCArIDJdID0gZ3JheVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5jeHQucHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcblx0fVxyXG59Il19
