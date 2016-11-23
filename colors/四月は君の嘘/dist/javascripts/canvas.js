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
				this.mask.cb = this.renderColors.bind(this);

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
					cxt.arc(obj.x, obj.y, v.r, 0, 2 * Math.PI, true);
					cxt.closePath();
					cxt.clip();
					cxt.drawImage(_this3.color_img || _this3.img, _this3.x, _this3.y, _this3.img_width, _this3.img_height);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbnZhcy5qcyJdLCJuYW1lcyI6WyJfZGVmYXVsdCIsIndpZHRoIiwiZG9jdW1lbnQiLCJib2R5Iiwib2Zmc2V0V2lkdGgiLCJoZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJ4IiwieSIsInIiLCJDYW52YXMiLCJlbCIsIm9wdGlvbiIsIk9iamVjdCIsImFzc2lnbiIsImNhbnZhcyIsInBhcnRpY2xlcyIsImN4dCIsImdldENvbnRleHQiLCJpc0FuaW1hdGUiLCJpbml0Iiwic2V0U2l6ZSIsImNyZWF0ZU1hc2siLCJjcmVhdGVDb2xvckNhbnZhcyIsImJvdW5kcyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIndyYXAiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJwb3NpdGlvbiIsIm1hc2siLCJmbiIsInVwZGF0ZUNvbG9ycyIsImJpbmQiLCJjYiIsInJlbmRlckNvbG9ycyIsInBhcmVudE5vZGUiLCJhcHBlbmRDaGlsZCIsImNvbG9yQ2FudmFzIiwiY3NzVGV4dCIsImNvbG9yQ2FudmFzQ3h0IiwiY2xlYXJSZWN0Iiwic3RvcCIsImUiLCJteCIsImNsaWVudFgiLCJsZWZ0IiwibXkiLCJjbGllbnRZIiwidG9wIiwidXBkYXRlIiwic3RlcCIsInJlbmRlciIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIkFycmF5IiwiZnJvbSIsInBhcnRpY2xlIiwiZmlsbFN0eWxlIiwiZ3JheUNvbG9yIiwiYmVnaW5QYXRoIiwiYXJjIiwiTWF0aCIsIlBJIiwiY2xvc2VQYXRoIiwiZmlsbCIsImRyYXdJbWFnZSIsIndhdmUiLCJsZW5ndGgiLCJub3ciLCJEYXRlIiwib2JqIiwidiIsInRyIiwidGltZVN0YW1wIiwibGl2ZSIsImluaXRpYWxUciIsImxhc3RUciIsImdsb2JhbEFscGhhIiwiY2xpcCIsImNvbG9yX2ltZyIsImltZyIsImltZ193aWR0aCIsImltZ19oZWlnaHQiLCJzcmMiLCJ0eXBlIiwiSW1hZ2UiLCJvbmxvYWQiLCJzZXRHcmF5SW1hZ2UiLCJnZXRJbWFnZURhdGEiLCJhcnIiLCJncmF5QXJyIiwic193aWR0aCIsInNfaGVpZ2h0IiwicG9zIiwiaSIsImoiLCJveCIsIm95IiwidngiLCJ2eSIsImNvbG9yIiwiam9pbiIsInB1c2giLCJpbWFnZURhdGEiLCJkYXRhIiwibGVuIiwiZ3JheSIsInBhcnNlSW50IiwicHV0SW1hZ2VEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsS0FBTUEsV0FBVztBQUNoQkMsU0FBT0MsU0FBU0MsSUFBVCxDQUFjQyxXQURMLEVBQ2tCO0FBQ2xDQyxVQUFRSCxTQUFTQyxJQUFULENBQWNHLFlBRk4sRUFFb0I7QUFDcENDLEtBQUcsQ0FIYTtBQUloQkMsS0FBRyxDQUphO0FBS2hCQyxLQUFHO0FBTGEsRUFBakI7O0tBVXFCQyxNO0FBQ3BCLGtCQUFZQyxFQUFaLEVBQWdCQyxNQUFoQixFQUF3QjtBQUFBOztBQUN2QkMsVUFBT0MsTUFBUCxDQUFjLElBQWQsRUFBb0JkLFFBQXBCLEVBQThCWSxNQUE5QjtBQUNBLFFBQUtHLE1BQUwsR0FBY0osRUFBZDtBQUNBLFFBQUtLLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxRQUFLQyxHQUFMLEdBQVcsS0FBS0YsTUFBTCxDQUFZRyxVQUFaLENBQXVCLElBQXZCLENBQVg7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsUUFBS0MsSUFBTDtBQUNBOzs7OzBCQUNNO0FBQ04sU0FBS0MsT0FBTCxDQUFhLEtBQUtOLE1BQWxCO0FBQ0EsU0FBS08sVUFBTDtBQUNBLFNBQUtDLGlCQUFMO0FBQ0EsU0FBS0MsTUFBTCxHQUFjLEtBQUtULE1BQUwsQ0FBWVUscUJBQVosRUFBZDtBQUNBOzs7Z0NBQ1k7QUFDWixTQUFLQyxJQUFMLEdBQVl4QixTQUFTeUIsYUFBVCxDQUF1QixNQUF2QixDQUFaO0FBQ0EsU0FBS0QsSUFBTCxDQUFVRSxLQUFWLENBQWdCQyxRQUFoQixHQUEyQixVQUEzQjtBQUNBLFNB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Q0EsUUFBSUMsTUFBTUYsVUFBVUMsSUFBVixDQUFlckMsTUFBekI7QUFDQSxRQUFJc0IsTUFBTSxFQUFWO0FBQ0EsUUFBSUMsVUFBVSxFQUFkO0FBQ0E7QUFDQSxRQUFJYSxVQUFVdEcsS0FBVixLQUFvQixLQUFLZ0YsU0FBN0IsRUFBd0MsS0FBS0EsU0FBTCxHQUFpQnNCLFVBQVV0RyxLQUEzQjtBQUN4QyxRQUFJc0csVUFBVWxHLE1BQVYsS0FBcUIsS0FBSzZFLFVBQTlCLEVBQTBDLEtBQUtBLFVBQUwsR0FBa0JxQixVQUFVbEcsTUFBNUI7QUFDMUMsU0FBSyxJQUFJeUYsSUFBSSxDQUFiLEVBQWdCQSxJQUFJVyxNQUFNLENBQTFCLEVBQTZCWCxHQUE3QixFQUFrQztBQUNqQyxTQUFJWSxPQUFPQyxTQUFTLENBQUNILEtBQUtWLElBQUksQ0FBVCxJQUFjVSxLQUFLVixJQUFJLENBQUosR0FBUSxDQUFiLENBQWQsR0FBZ0NVLEtBQUtWLElBQUksQ0FBSixHQUFRLENBQWIsQ0FBakMsSUFBb0QsQ0FBN0QsQ0FBWDtBQUNBVSxVQUFLVixJQUFJLENBQVQsSUFBY1UsS0FBS1YsSUFBSSxDQUFKLEdBQVEsQ0FBYixJQUFrQlUsS0FBS1YsSUFBSSxDQUFKLEdBQVEsQ0FBYixJQUFrQlksSUFBbEQ7QUFDQTtBQUNELFNBQUt6RixHQUFMLENBQVMyRixZQUFULENBQXNCTCxTQUF0QixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQztBQUNBOzs7Ozs7bUJBdExtQjdGLE0iLCJmaWxlIjoiY2FudmFzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXHJcblxyXG5jb25zdCBfZGVmYXVsdCA9IHtcclxuXHR3aWR0aDogZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aCwgLy9jYW52YXPnmoTlrr3luqbvvIzpu5jorqTnqpflj6Plrr3luqZcclxuXHRoZWlnaHQ6IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0LCAvL2NhbnZhc+eahOmrmOW6pu+8jOm7mOiupOeql+WPo+mrmOW6plxyXG5cdHg6IDAsXHJcblx0eTogMCxcclxuXHRyOiAxXHJcbn1cclxuXHJcbmltcG9ydCBXYXZlIGZyb20gJ3dhdmUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzIHtcclxuXHRjb25zdHJ1Y3RvcihlbCwgb3B0aW9uKSB7XHJcblx0XHRPYmplY3QuYXNzaWduKHRoaXMsIF9kZWZhdWx0LCBvcHRpb24pXHJcblx0XHR0aGlzLmNhbnZhcyA9IGVsXHJcblx0XHR0aGlzLnBhcnRpY2xlcyA9IFtdXHJcblx0XHR0aGlzLmN4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuXHRcdHRoaXMuaXNBbmltYXRlID0gZmFsc2VcclxuXHRcdHRoaXMuaW5pdCgpXHJcblx0fVxyXG5cdGluaXQoKSB7XHJcblx0XHR0aGlzLnNldFNpemUodGhpcy5jYW52YXMpXHJcblx0XHR0aGlzLmNyZWF0ZU1hc2soKVxyXG5cdFx0dGhpcy5jcmVhdGVDb2xvckNhbnZhcygpXHJcblx0XHR0aGlzLmJvdW5kcyA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblx0fVxyXG5cdGNyZWF0ZU1hc2soKSB7XHJcblx0XHR0aGlzLndyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuXHRcdHRoaXMud3JhcC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcclxuXHRcdHRoaXMubWFzayA9IG5ldyBXYXZlKHtcclxuXHRcdFx0d2lkdGg6IHRoaXMud2lkdGgsXHJcblx0XHRcdGhlaWdodDogdGhpcy5oZWlnaHRcclxuXHRcdH0pXHJcblxyXG5cdFx0dGhpcy5tYXNrLmZuID0gdGhpcy51cGRhdGVDb2xvcnMuYmluZCh0aGlzKVxyXG5cdFx0dGhpcy5tYXNrLmNiID0gdGhpcy5yZW5kZXJDb2xvcnMuYmluZCh0aGlzKVxyXG5cclxuXHRcdGxldCBwYXJlbnROb2RlID0gdGhpcy5jYW52YXMucGFyZW50Tm9kZVxyXG5cdFx0dGhpcy53cmFwLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKVxyXG5cdFx0dGhpcy53cmFwLmFwcGVuZENoaWxkKHRoaXMubWFzay5jYW52YXMpXHJcblx0XHRwYXJlbnROb2RlLmFwcGVuZENoaWxkKHRoaXMud3JhcClcclxuXHR9XHJcblx0Y3JlYXRlQ29sb3JDYW52YXMoKSB7XHJcblx0XHR0aGlzLmNvbG9yQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcclxuXHRcdHRoaXMuc2V0U2l6ZSh0aGlzLmNvbG9yQ2FudmFzKVxyXG5cdFx0dGhpcy5jb2xvckNhbnZhcy5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyB6LWluZGV4OiAxOydcclxuXHRcdHRoaXMuY29sb3JDYW52YXNDeHQgPSB0aGlzLmNvbG9yQ2FudmFzLmdldENvbnRleHQoJzJkJylcclxuXHRcdHRoaXMud3JhcC5hcHBlbmRDaGlsZCh0aGlzLmNvbG9yQ2FudmFzKVxyXG5cdH1cclxuXHRkZXN0b3J5KCkge1xyXG5cdFx0dGhpcy5jeHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxyXG5cdFx0dGhpcy5zdG9wKClcclxuXHR9XHJcblx0Z2V0TW91c2VQb3MoZSkge1xyXG5cdCAgICB0aGlzLm14ID0gZS5jbGllbnRYIC0gdGhpcy5ib3VuZHMubGVmdFxyXG5cdFx0dGhpcy5teSA9IGUuY2xpZW50WSAtIHRoaXMuYm91bmRzLnRvcFxyXG5cdFx0dGhpcy51cGRhdGUoKVxyXG5cdH1cclxuXHRzZXRTaXplKGVsKSB7XHJcblx0XHRlbC53aWR0aCA9IHRoaXMud2lkdGhcclxuXHRcdGVsLmhlaWdodCA9IHRoaXMuaGVpZ2h0XHJcblx0fVxyXG5cdHN0YXJ0KCkge1xyXG5cdFx0aWYgKHRoaXMuaXNBbmltYXRlKSByZXR1cm4gZmFsc2VcclxuXHJcblx0XHR0aGlzLmlzQW5pbWF0ZSA9IHRydWVcclxuXHRcdGNvbnN0IHN0ZXAgPSAoKSA9PiB7XHJcblx0XHRcdGlmICghdGhpcy5pc0FuaW1hdGUpIHJldHVybiBmYWxzZVxyXG5cdFx0XHR0aGlzLnJlbmRlcigpXHJcblx0XHRcdHRoaXMudXBkYXRlKClcclxuXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcblx0XHR9XHJcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuXHR9XHJcblx0c3RvcCgpIHtcclxuXHRcdHRoaXMuaXNBbmltYXRlID0gZmFsc2VcclxuXHR9XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0dGhpcy5jeHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxyXG5cclxuXHRcdEFycmF5LmZyb20odGhpcy5wYXJ0aWNsZXMsIChwYXJ0aWNsZSkgPT4ge1xyXG5cdFx0XHR0aGlzLmN4dC5maWxsU3R5bGUgPSAncmdiYSgnICsgcGFydGljbGUuZ3JheUNvbG9yICsgJyknXHJcblxyXG5cdFx0XHR0aGlzLmN4dC5iZWdpblBhdGgoKVxyXG5cdFx0XHR0aGlzLmN4dC5hcmMocGFydGljbGUueCwgcGFydGljbGUueSwgdGhpcy5yLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSlcclxuXHRcdFx0dGhpcy5jeHQuY2xvc2VQYXRoKClcclxuXHJcblx0XHRcdHRoaXMuY3h0LmZpbGwoKVxyXG5cdFx0fSlcclxuXHR9XHJcblx0cmVuZGVyQ29sb3JzKGNhbnZhcykge1xyXG5cdFx0dGhpcy5jeHQuZHJhd0ltYWdlKGNhbnZhcywgdGhpcy54LCB0aGlzLnkpXHJcblx0fVxyXG5cdHVwZGF0ZUNvbG9ycygpIHtcclxuXHRcdGlmICh0aGlzLm1hc2sud2F2ZS5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZVxyXG5cdFx0Ly8g56a75bGP5riy5p+TXHJcblx0XHRsZXQgbm93ID0gRGF0ZS5ub3coKVxyXG5cdFx0dGhpcy5jb2xvckNhbnZhc0N4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXHJcblx0XHRBcnJheS5mcm9tKHRoaXMubWFzay53YXZlLCBvYmogPT4ge1xyXG5cdFx0XHRvYmouY2FudmFzLndpZHRoID0gdGhpcy53aWR0aFxyXG5cdFx0XHRvYmouY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0XHJcblx0XHRcdGxldCBjeHQgPSBvYmouY3h0XHJcblx0XHRcdGN4dC5iZWdpblBhdGgoKVxyXG5cdFx0XHRsZXQgdiA9IG9iai5hcmNbMF1cclxuXHRcdFx0bGV0IHRyID0gKDEgLSAobm93IC0gb2JqLnRpbWVTdGFtcCkgLyBvYmoubGl2ZSkgKiAob2JqLmluaXRpYWxUciAtIG9iai5sYXN0VHIpICsgb2JqLmxhc3RUclxyXG5cdFx0XHRjeHQuZ2xvYmFsQWxwaGEgPSB0ciA8IDAgPyAwIDogdHJcclxuXHRcdFx0Y3h0LmFyYyhvYmoueCwgb2JqLnksIHYuciwgMCwgMiAqIE1hdGguUEksIHRydWUpXHJcblx0XHRcdGN4dC5jbG9zZVBhdGgoKVxyXG5cdFx0XHRjeHQuY2xpcCgpXHJcblx0XHRcdGN4dC5kcmF3SW1hZ2UodGhpcy5jb2xvcl9pbWcgfHwgdGhpcy5pbWcgLCB0aGlzLngsIHRoaXMueSwgdGhpcy5pbWdfd2lkdGgsIHRoaXMuaW1nX2hlaWdodClcclxuXHRcdFx0dGhpcy5jb2xvckNhbnZhc0N4dC5kcmF3SW1hZ2Uob2JqLmNhbnZhcywgdGhpcy54LCB0aGlzLnkpXHJcblx0XHR9KVxyXG5cdH1cclxuXHRzZXRJbWFnZShzcmMsIHR5cGUpIHtcclxuXHRcdGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxyXG5cdFx0aW1nLm9ubG9hZCA9ICgpID0+IHtcclxuXHRcdFx0aWYgKHR5cGUgPT09ICdjb2xvcnMnKSB7XHJcblx0XHRcdFx0dGhpcy5jb2xvcl9pbWcgPSBpbWdcclxuXHRcdFx0XHR0aGlzLmNvbG9yX2ltZy53aWR0aCA9IHRoaXMud2lkdGhcclxuXHRcdFx0XHR0aGlzLmNvbG9yX2ltZy5oZWlnaHQgPSB0aGlzLmhlaWdodFxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuaW1nID0gaW1nXHJcblx0XHRcdFx0dGhpcy5pbWdfd2lkdGggPSB0aGlzLmltZy53aWR0aCA9IHRoaXMud2lkdGhcclxuXHRcdFx0XHR0aGlzLmltZ19oZWlnaHQgPSB0aGlzLmltZy5oZWlnaHQgPSB0aGlzLmhlaWdodFxyXG5cdFx0XHRcdHRoaXMuY3h0LmRyYXdJbWFnZSh0aGlzLmltZywgdGhpcy54LCB0aGlzLnksIHRoaXMuaW1nX3dpZHRoLCB0aGlzLmltZ19oZWlnaHQpXHJcblx0XHRcdFx0dGhpcy5zZXRHcmF5SW1hZ2UoKVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8qIOWbvueJh+eykuWtkOWMliwg55uu5YmN5pyq55So5YiwICovXHJcblx0XHRcdFx0Ly8gdGhpcy5nZXRQYXJ0aWNsZSgpXHJcblx0XHRcdFx0Ly8gdGhpcy5yZW5kZXIoKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpbWcuc3JjID0gc3JjXHJcblx0fVxyXG5cdGdldFBhcnRpY2xlKCkge1xyXG5cdFx0dGhpcy5wYXJ0aWNsZXMgPSBbXVxyXG5cdFx0bGV0IHsgYXJyLCBncmF5QXJyIH0gPSB0aGlzLmdldEltYWdlRGF0YSgpXHJcblx0XHRsZXQgc193aWR0aCA9IDFcclxuXHRcdGxldCBzX2hlaWdodCA9IDFcclxuXHRcdGxldCBwb3MgPSAwXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW1nX3dpZHRoOyBpKyspIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmltZ19oZWlnaHQ7IGorKykge1xyXG5cdFx0XHRcdHBvcyA9IChqICogc19oZWlnaHQpICogKHRoaXMuaW1nX3dpZHRoKSArIChpICogc193aWR0aClcclxuXHRcdFx0XHRsZXQgeCA9IHRoaXMueCArIGkgKiBzX3dpZHRoXHJcblx0XHRcdFx0bGV0IHkgPSB0aGlzLnkgKyBqICogc19oZWlnaHRcclxuXHRcdFx0XHRsZXQgcGFydGljbGUgPSB7XHJcblx0XHRcdFx0XHR4OiB4LFxyXG5cdFx0XHRcdFx0eTogeSxcclxuXHRcdFx0XHRcdG94OiB4LFxyXG5cdFx0XHRcdFx0b3k6IHksXHJcblx0XHRcdFx0XHR2eDogMCxcclxuXHRcdFx0XHRcdHZ5OiAwLFxyXG5cdFx0XHRcdFx0Y29sb3I6IGFycltwb3NdLmpvaW4oJywnKSxcclxuXHRcdFx0XHRcdGdyYXlDb2xvcjogZ3JheUFycltwb3NdLmpvaW4oJywnKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnBhcnRpY2xlcy5wdXNoKHBhcnRpY2xlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldEltYWdlRGF0YSgpIHtcclxuXHRcdGxldCBpbWFnZURhdGEgPSB0aGlzLmN4dC5nZXRJbWFnZURhdGEodGhpcy54LCB0aGlzLnksIHRoaXMuaW1nX3dpZHRoLCB0aGlzLmltZ19oZWlnaHQpXHJcblx0XHRsZXQgZGF0YSA9IGltYWdlRGF0YS5kYXRhXHJcblx0XHRsZXQgbGVuID0gaW1hZ2VEYXRhLmRhdGEubGVuZ3RoXHJcblx0XHRsZXQgYXJyID0gW11cclxuXHRcdGxldCBncmF5QXJyID0gW11cclxuXHRcdC8v6L+35LmL5LiN55u4562J77yfXHJcblx0XHRpZiAoaW1hZ2VEYXRhLndpZHRoICE9PSB0aGlzLmltZ193aWR0aCkgdGhpcy5pbWdfd2lkdGggPSBpbWFnZURhdGEud2lkdGhcclxuXHRcdGlmIChpbWFnZURhdGEuaGVpZ2h0ICE9PSB0aGlzLmltZ19oZWlnaHQpIHRoaXMuaW1nX2hlaWdodCA9IGltYWdlRGF0YS5oZWlnaHRcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuIC8gNDsgaSsrKSB7XHJcblx0XHRcdGxldCBncmF5ID0gcGFyc2VJbnQoKGRhdGFbaSAqIDRdICsgZGF0YVtpICogNCArIDFdICsgZGF0YVtpICogNCArIDJdKSAvIDMpXHJcblx0XHRcdGFyci5wdXNoKFtkYXRhW2kgKiA0XSwgZGF0YVtpICogNCArIDFdLCBkYXRhW2kgKiA0ICsgMl0sIGRhdGFbaSAqIDQgKyAzXV0pXHJcblx0XHRcdGdyYXlBcnIucHVzaChbZ3JheSwgZ3JheSwgZ3JheSwgMV0pXHJcblx0XHR9XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRhcnIsXHJcblx0XHRcdGdyYXlBcnJcclxuXHRcdH1cclxuXHR9XHJcblx0c2V0R3JheUltYWdlKCkge1xyXG5cdFx0bGV0IGltYWdlRGF0YSA9IHRoaXMuY3h0LmdldEltYWdlRGF0YSh0aGlzLngsIHRoaXMueSwgdGhpcy5pbWdfd2lkdGgsIHRoaXMuaW1nX2hlaWdodClcclxuXHRcdGxldCBkYXRhID0gaW1hZ2VEYXRhLmRhdGFcclxuXHRcdGxldCBsZW4gPSBpbWFnZURhdGEuZGF0YS5sZW5ndGhcclxuXHRcdGxldCBhcnIgPSBbXVxyXG5cdFx0bGV0IGdyYXlBcnIgPSBbXVxyXG5cdFx0Ly/ov7fkuYvkuI3nm7jnrYnvvJ9cclxuXHRcdGlmIChpbWFnZURhdGEud2lkdGggIT09IHRoaXMuaW1nX3dpZHRoKSB0aGlzLmltZ193aWR0aCA9IGltYWdlRGF0YS53aWR0aFxyXG5cdFx0aWYgKGltYWdlRGF0YS5oZWlnaHQgIT09IHRoaXMuaW1nX2hlaWdodCkgdGhpcy5pbWdfaGVpZ2h0ID0gaW1hZ2VEYXRhLmhlaWdodFxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW4gLyA0OyBpKyspIHtcclxuXHRcdFx0bGV0IGdyYXkgPSBwYXJzZUludCgoZGF0YVtpICogNF0gKyBkYXRhW2kgKiA0ICsgMV0gKyBkYXRhW2kgKiA0ICsgMl0pIC8gMylcclxuXHRcdFx0ZGF0YVtpICogNF0gPSBkYXRhW2kgKiA0ICsgMV0gPSBkYXRhW2kgKiA0ICsgMl0gPSBncmF5XHJcblx0XHR9XHJcblx0XHR0aGlzLmN4dC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcclxuXHR9XHJcbn0iXX0=
