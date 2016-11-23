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
					// let tr = (1 - (now - obj.timeStamp) / obj.live) * (obj.initialTr - obj.lastTr) + obj.lastTr
					// cxt.globalAlpha = tr < 0 ? 0 : tr
					cxt.globalAlpha = v.opacity;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbnZhcy5qcyJdLCJuYW1lcyI6WyJfZGVmYXVsdCIsIndpZHRoIiwiZG9jdW1lbnQiLCJib2R5Iiwib2Zmc2V0V2lkdGgiLCJoZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJ4IiwieSIsInIiLCJDYW52YXMiLCJlbCIsIm9wdGlvbiIsIk9iamVjdCIsImFzc2lnbiIsImNhbnZhcyIsInBhcnRpY2xlcyIsImN4dCIsImdldENvbnRleHQiLCJpc0FuaW1hdGUiLCJpbml0Iiwic2V0U2l6ZSIsImNyZWF0ZU1hc2siLCJjcmVhdGVDb2xvckNhbnZhcyIsImJvdW5kcyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIndyYXAiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJwb3NpdGlvbiIsIm1hc2siLCJmbiIsInVwZGF0ZUNvbG9ycyIsImJpbmQiLCJjYiIsInJlbmRlckNvbG9ycyIsInBhcmVudE5vZGUiLCJhcHBlbmRDaGlsZCIsImNvbG9yQ2FudmFzIiwiY3NzVGV4dCIsImNvbG9yQ2FudmFzQ3h0IiwiY2xlYXJSZWN0Iiwic3RvcCIsImUiLCJteCIsImNsaWVudFgiLCJsZWZ0IiwibXkiLCJjbGllbnRZIiwidG9wIiwidXBkYXRlIiwic3RlcCIsInJlbmRlciIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIkFycmF5IiwiZnJvbSIsInBhcnRpY2xlIiwiZmlsbFN0eWxlIiwiZ3JheUNvbG9yIiwiYmVnaW5QYXRoIiwiYXJjIiwiTWF0aCIsIlBJIiwiY2xvc2VQYXRoIiwiZmlsbCIsImRyYXdJbWFnZSIsIndhdmUiLCJsZW5ndGgiLCJub3ciLCJEYXRlIiwib2JqIiwidiIsImdsb2JhbEFscGhhIiwib3BhY2l0eSIsImNsaXAiLCJjb2xvcl9pbWciLCJpbWciLCJpbWdfd2lkdGgiLCJpbWdfaGVpZ2h0Iiwic3JjIiwidHlwZSIsIkltYWdlIiwib25sb2FkIiwic2V0R3JheUltYWdlIiwiZ2V0SW1hZ2VEYXRhIiwiYXJyIiwiZ3JheUFyciIsInNfd2lkdGgiLCJzX2hlaWdodCIsInBvcyIsImkiLCJqIiwib3giLCJveSIsInZ4IiwidnkiLCJjb2xvciIsImpvaW4iLCJwdXNoIiwiaW1hZ2VEYXRhIiwiZGF0YSIsImxlbiIsImdyYXkiLCJwYXJzZUludCIsInB1dEltYWdlRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLEtBQU1BLFdBQVc7QUFDaEJDLFNBQU9DLFNBQVNDLElBQVQsQ0FBY0MsV0FETCxFQUNrQjtBQUNsQ0MsVUFBUUgsU0FBU0MsSUFBVCxDQUFjRyxZQUZOLEVBRW9CO0FBQ3BDQyxLQUFHLENBSGE7QUFJaEJDLEtBQUcsQ0FKYTtBQUtoQkMsS0FBRztBQUxhLEVBQWpCOztLQVVxQkMsTTtBQUNwQixrQkFBWUMsRUFBWixFQUFnQkMsTUFBaEIsRUFBd0I7QUFBQTs7QUFDdkJDLFVBQU9DLE1BQVAsQ0FBYyxJQUFkLEVBQW9CZCxRQUFwQixFQUE4QlksTUFBOUI7QUFDQSxRQUFLRyxNQUFMLEdBQWNKLEVBQWQ7QUFDQSxRQUFLSyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsUUFBS0MsR0FBTCxHQUFXLEtBQUtGLE1BQUwsQ0FBWUcsVUFBWixDQUF1QixJQUF2QixDQUFYO0FBQ0EsUUFBS0MsU0FBTCxHQUFpQixLQUFqQjtBQUNBLFFBQUtDLElBQUw7QUFDQTs7OzswQkFDTTtBQUNOLFNBQUtDLE9BQUwsQ0FBYSxLQUFLTixNQUFsQjtBQUNBLFNBQUtPLFVBQUw7QUFDQSxTQUFLQyxpQkFBTDtBQUNBLFNBQUtDLE1BQUwsR0FBYyxLQUFLVCxNQUFMLENBQVlVLHFCQUFaLEVBQWQ7QUFDQTs7O2dDQUNZO0FBQ1osU0FBS0MsSUFBTCxHQUFZeEIsU0FBU3lCLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBWjtBQUNBLFNBQUtELElBQUwsQ0FBVUUsS0FBVixDQUFnQkMsUUFBaEIsR0FBMkIsVUFBM0I7QUFDQSxTQUFLQyxJQUFMLEdBQVksbUJBQVM7QUFDcEI3QixZQUFPLEtB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Q3hDLFFBQUlrRyxVQUFVOUYsTUFBVixLQUFxQixLQUFLeUUsVUFBOUIsRUFBMEMsS0FBS0EsVUFBTCxHQUFrQnFCLFVBQVU5RixNQUE1QjtBQUMxQyxTQUFLLElBQUlxRixJQUFJLENBQWIsRUFBZ0JBLElBQUlXLE1BQU0sQ0FBMUIsRUFBNkJYLEdBQTdCLEVBQWtDO0FBQ2pDLFNBQUlZLE9BQU9DLFNBQVMsQ0FBQ0gsS0FBS1YsSUFBSSxDQUFULElBQWNVLEtBQUtWLElBQUksQ0FBSixHQUFRLENBQWIsQ0FBZCxHQUFnQ1UsS0FBS1YsSUFBSSxDQUFKLEdBQVEsQ0FBYixDQUFqQyxJQUFvRCxDQUE3RCxDQUFYO0FBQ0FVLFVBQUtWLElBQUksQ0FBVCxJQUFjVSxLQUFLVixJQUFJLENBQUosR0FBUSxDQUFiLElBQWtCVSxLQUFLVixJQUFJLENBQUosR0FBUSxDQUFiLElBQWtCWSxJQUFsRDtBQUNBO0FBQ0QsU0FBS3JGLEdBQUwsQ0FBU3VGLFlBQVQsQ0FBc0JMLFNBQXRCLEVBQWlDLENBQWpDLEVBQW9DLENBQXBDO0FBQ0E7Ozs7OzttQkF2TG1CekYsTSIsImZpbGUiOiJjYW52YXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IF9kZWZhdWx0ID0ge1xyXG5cdHdpZHRoOiBkb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoLCAvL2NhbnZhc+eahOWuveW6pu+8jOm7mOiupOeql+WPo+WuveW6plxyXG5cdGhlaWdodDogZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQsIC8vY2FudmFz55qE6auY5bqm77yM6buY6K6k56qX5Y+j6auY5bqmXHJcblx0eDogMCxcclxuXHR5OiAwLFxyXG5cdHI6IDFcclxufVxyXG5cclxuaW1wb3J0IFdhdmUgZnJvbSAnd2F2ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXMge1xyXG5cdGNvbnN0cnVjdG9yKGVsLCBvcHRpb24pIHtcclxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgX2RlZmF1bHQsIG9wdGlvbilcclxuXHRcdHRoaXMuY2FudmFzID0gZWxcclxuXHRcdHRoaXMucGFydGljbGVzID0gW11cclxuXHRcdHRoaXMuY3h0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG5cdFx0dGhpcy5pc0FuaW1hdGUgPSBmYWxzZVxyXG5cdFx0dGhpcy5pbml0KClcclxuXHR9XHJcblx0aW5pdCgpIHtcclxuXHRcdHRoaXMuc2V0U2l6ZSh0aGlzLmNhbnZhcylcclxuXHRcdHRoaXMuY3JlYXRlTWFzaygpXHJcblx0XHR0aGlzLmNyZWF0ZUNvbG9yQ2FudmFzKClcclxuXHRcdHRoaXMuYm91bmRzID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuXHR9XHJcblx0Y3JlYXRlTWFzaygpIHtcclxuXHRcdHRoaXMud3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG5cdFx0dGhpcy53cmFwLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xyXG5cdFx0dGhpcy5tYXNrID0gbmV3IFdhdmUoe1xyXG5cdFx0XHR3aWR0aDogdGhpcy53aWR0aCxcclxuXHRcdFx0aGVpZ2h0OiB0aGlzLmhlaWdodFxyXG5cdFx0fSlcclxuXHJcblx0XHR0aGlzLm1hc2suZm4gPSB0aGlzLnVwZGF0ZUNvbG9ycy5iaW5kKHRoaXMpXHJcblx0XHR0aGlzLm1hc2suY2IgPSB0aGlzLnJlbmRlckNvbG9ycy5iaW5kKHRoaXMpXHJcblxyXG5cdFx0bGV0IHBhcmVudE5vZGUgPSB0aGlzLmNhbnZhcy5wYXJlbnROb2RlXHJcblx0XHR0aGlzLndyYXAuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpXHJcblx0XHR0aGlzLndyYXAuYXBwZW5kQ2hpbGQodGhpcy5tYXNrLmNhbnZhcylcclxuXHRcdHBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGhpcy53cmFwKVxyXG5cdH1cclxuXHRjcmVhdGVDb2xvckNhbnZhcygpIHtcclxuXHRcdHRoaXMuY29sb3JDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxyXG5cdFx0dGhpcy5zZXRTaXplKHRoaXMuY29sb3JDYW52YXMpXHJcblx0XHR0aGlzLmNvbG9yQ2FudmFzLnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IHotaW5kZXg6IDE7J1xyXG5cdFx0dGhpcy5jb2xvckNhbnZhc0N4dCA9IHRoaXMuY29sb3JDYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG5cdFx0dGhpcy53cmFwLmFwcGVuZENoaWxkKHRoaXMuY29sb3JDYW52YXMpXHJcblx0fVxyXG5cdGRlc3RvcnkoKSB7XHJcblx0XHR0aGlzLmN4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXHJcblx0XHR0aGlzLnN0b3AoKVxyXG5cdH1cclxuXHRnZXRNb3VzZVBvcyhlKSB7XHJcblx0ICAgIHRoaXMubXggPSBlLmNsaWVudFggLSB0aGlzLmJvdW5kcy5sZWZ0XHJcblx0XHR0aGlzLm15ID0gZS5jbGllbnRZIC0gdGhpcy5ib3VuZHMudG9wXHJcblx0XHR0aGlzLnVwZGF0ZSgpXHJcblx0fVxyXG5cdHNldFNpemUoZWwpIHtcclxuXHRcdGVsLndpZHRoID0gdGhpcy53aWR0aFxyXG5cdFx0ZWwuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcclxuXHR9XHJcblx0c3RhcnQoKSB7XHJcblx0XHRpZiAodGhpcy5pc0FuaW1hdGUpIHJldHVybiBmYWxzZVxyXG5cclxuXHRcdHRoaXMuaXNBbmltYXRlID0gdHJ1ZVxyXG5cdFx0Y29uc3Qgc3RlcCA9ICgpID0+IHtcclxuXHRcdFx0aWYgKCF0aGlzLmlzQW5pbWF0ZSkgcmV0dXJuIGZhbHNlXHJcblx0XHRcdHRoaXMucmVuZGVyKClcclxuXHRcdFx0dGhpcy51cGRhdGUoKVxyXG5cdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuXHRcdH1cclxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG5cdH1cclxuXHRzdG9wKCkge1xyXG5cdFx0dGhpcy5pc0FuaW1hdGUgPSBmYWxzZVxyXG5cdH1cclxuXHRyZW5kZXIoKSB7XHJcblx0XHR0aGlzLmN4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXHJcblxyXG5cdFx0QXJyYXkuZnJvbSh0aGlzLnBhcnRpY2xlcywgKHBhcnRpY2xlKSA9PiB7XHJcblx0XHRcdHRoaXMuY3h0LmZpbGxTdHlsZSA9ICdyZ2JhKCcgKyBwYXJ0aWNsZS5ncmF5Q29sb3IgKyAnKSdcclxuXHJcblx0XHRcdHRoaXMuY3h0LmJlZ2luUGF0aCgpXHJcblx0XHRcdHRoaXMuY3h0LmFyYyhwYXJ0aWNsZS54LCBwYXJ0aWNsZS55LCB0aGlzLnIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKVxyXG5cdFx0XHR0aGlzLmN4dC5jbG9zZVBhdGgoKVxyXG5cclxuXHRcdFx0dGhpcy5jeHQuZmlsbCgpXHJcblx0XHR9KVxyXG5cdH1cclxuXHRyZW5kZXJDb2xvcnMoY2FudmFzKSB7XHJcblx0XHR0aGlzLmN4dC5kcmF3SW1hZ2UoY2FudmFzLCB0aGlzLngsIHRoaXMueSlcclxuXHR9XHJcblx0dXBkYXRlQ29sb3JzKCkge1xyXG5cdFx0aWYgKHRoaXMubWFzay53YXZlLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlXHJcblx0XHQvLyDnprvlsY/muLLmn5NcclxuXHRcdGxldCBub3cgPSBEYXRlLm5vdygpXHJcblx0XHR0aGlzLmNvbG9yQ2FudmFzQ3h0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcclxuXHRcdEFycmF5LmZyb20odGhpcy5tYXNrLndhdmUsIG9iaiA9PiB7XHJcblx0XHRcdG9iai5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoXHJcblx0XHRcdG9iai5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcclxuXHRcdFx0bGV0IGN4dCA9IG9iai5jeHRcclxuXHRcdFx0Y3h0LmJlZ2luUGF0aCgpXHJcblx0XHRcdGxldCB2ID0gb2JqLmFyY1swXVxyXG5cdFx0XHQvLyBsZXQgdHIgPSAoMSAtIChub3cgLSBvYmoudGltZVN0YW1wKSAvIG9iai5saXZlKSAqIChvYmouaW5pdGlhbFRyIC0gb2JqLmxhc3RUcikgKyBvYmoubGFzdFRyXHJcblx0XHRcdC8vIGN4dC5nbG9iYWxBbHBoYSA9IHRyIDwgMCA/IDAgOiB0clxyXG5cdFx0XHRjeHQuZ2xvYmFsQWxwaGEgPSB2Lm9wYWNpdHlcclxuXHRcdFx0Y3h0LmFyYyhvYmoueCwgb2JqLnksIHYuciwgMCwgMiAqIE1hdGguUEksIHRydWUpXHJcblx0XHRcdGN4dC5jbG9zZVBhdGgoKVxyXG5cdFx0XHRjeHQuY2xpcCgpXHJcblx0XHRcdGN4dC5kcmF3SW1hZ2UodGhpcy5jb2xvcl9pbWcgfHwgdGhpcy5pbWcgLCB0aGlzLngsIHRoaXMueSwgdGhpcy5pbWdfd2lkdGgsIHRoaXMuaW1nX2hlaWdodClcclxuXHRcdFx0dGhpcy5jb2xvckNhbnZhc0N4dC5kcmF3SW1hZ2Uob2JqLmNhbnZhcywgdGhpcy54LCB0aGlzLnkpXHJcblx0XHR9KVxyXG5cdH1cclxuXHRzZXRJbWFnZShzcmMsIHR5cGUpIHtcclxuXHRcdGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxyXG5cdFx0aW1nLm9ubG9hZCA9ICgpID0+IHtcclxuXHRcdFx0aWYgKHR5cGUgPT09ICdjb2xvcnMnKSB7XHJcblx0XHRcdFx0dGhpcy5jb2xvcl9pbWcgPSBpbWdcclxuXHRcdFx0XHR0aGlzLmNvbG9yX2ltZy53aWR0aCA9IHRoaXMud2lkdGhcclxuXHRcdFx0XHR0aGlzLmNvbG9yX2ltZy5oZWlnaHQgPSB0aGlzLmhlaWdodFxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuaW1nID0gaW1nXHJcblx0XHRcdFx0dGhpcy5pbWdfd2lkdGggPSB0aGlzLmltZy53aWR0aCA9IHRoaXMud2lkdGhcclxuXHRcdFx0XHR0aGlzLmltZ19oZWlnaHQgPSB0aGlzLmltZy5oZWlnaHQgPSB0aGlzLmhlaWdodFxyXG5cdFx0XHRcdHRoaXMuY3h0LmRyYXdJbWFnZSh0aGlzLmltZywgdGhpcy54LCB0aGlzLnksIHRoaXMuaW1nX3dpZHRoLCB0aGlzLmltZ19oZWlnaHQpXHJcblx0XHRcdFx0dGhpcy5zZXRHcmF5SW1hZ2UoKVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8qIOWbvueJh+eykuWtkOWMliwg55uu5YmN5pyq55So5YiwICovXHJcblx0XHRcdFx0Ly8gdGhpcy5nZXRQYXJ0aWNsZSgpXHJcblx0XHRcdFx0Ly8gdGhpcy5yZW5kZXIoKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpbWcuc3JjID0gc3JjXHJcblx0fVxyXG5cdGdldFBhcnRpY2xlKCkge1xyXG5cdFx0dGhpcy5wYXJ0aWNsZXMgPSBbXVxyXG5cdFx0bGV0IHsgYXJyLCBncmF5QXJyIH0gPSB0aGlzLmdldEltYWdlRGF0YSgpXHJcblx0XHRsZXQgc193aWR0aCA9IDFcclxuXHRcdGxldCBzX2hlaWdodCA9IDFcclxuXHRcdGxldCBwb3MgPSAwXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW1nX3dpZHRoOyBpKyspIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmltZ19oZWlnaHQ7IGorKykge1xyXG5cdFx0XHRcdHBvcyA9IChqICogc19oZWlnaHQpICogKHRoaXMuaW1nX3dpZHRoKSArIChpICogc193aWR0aClcclxuXHRcdFx0XHRsZXQgeCA9IHRoaXMueCArIGkgKiBzX3dpZHRoXHJcblx0XHRcdFx0bGV0IHkgPSB0aGlzLnkgKyBqICogc19oZWlnaHRcclxuXHRcdFx0XHRsZXQgcGFydGljbGUgPSB7XHJcblx0XHRcdFx0XHR4OiB4LFxyXG5cdFx0XHRcdFx0eTogeSxcclxuXHRcdFx0XHRcdG94OiB4LFxyXG5cdFx0XHRcdFx0b3k6IHksXHJcblx0XHRcdFx0XHR2eDogMCxcclxuXHRcdFx0XHRcdHZ5OiAwLFxyXG5cdFx0XHRcdFx0Y29sb3I6IGFycltwb3NdLmpvaW4oJywnKSxcclxuXHRcdFx0XHRcdGdyYXlDb2xvcjogZ3JheUFycltwb3NdLmpvaW4oJywnKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnBhcnRpY2xlcy5wdXNoKHBhcnRpY2xlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGdldEltYWdlRGF0YSgpIHtcclxuXHRcdGxldCBpbWFnZURhdGEgPSB0aGlzLmN4dC5nZXRJbWFnZURhdGEodGhpcy54LCB0aGlzLnksIHRoaXMuaW1nX3dpZHRoLCB0aGlzLmltZ19oZWlnaHQpXHJcblx0XHRsZXQgZGF0YSA9IGltYWdlRGF0YS5kYXRhXHJcblx0XHRsZXQgbGVuID0gaW1hZ2VEYXRhLmRhdGEubGVuZ3RoXHJcblx0XHRsZXQgYXJyID0gW11cclxuXHRcdGxldCBncmF5QXJyID0gW11cclxuXHRcdC8v6L+35LmL5LiN55u4562J77yfXHJcblx0XHRpZiAoaW1hZ2VEYXRhLndpZHRoICE9PSB0aGlzLmltZ193aWR0aCkgdGhpcy5pbWdfd2lkdGggPSBpbWFnZURhdGEud2lkdGhcclxuXHRcdGlmIChpbWFnZURhdGEuaGVpZ2h0ICE9PSB0aGlzLmltZ19oZWlnaHQpIHRoaXMuaW1nX2hlaWdodCA9IGltYWdlRGF0YS5oZWlnaHRcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuIC8gNDsgaSsrKSB7XHJcblx0XHRcdGxldCBncmF5ID0gcGFyc2VJbnQoKGRhdGFbaSAqIDRdICsgZGF0YVtpICogNCArIDFdICsgZGF0YVtpICogNCArIDJdKSAvIDMpXHJcblx0XHRcdGFyci5wdXNoKFtkYXRhW2kgKiA0XSwgZGF0YVtpICogNCArIDFdLCBkYXRhW2kgKiA0ICsgMl0sIGRhdGFbaSAqIDQgKyAzXV0pXHJcblx0XHRcdGdyYXlBcnIucHVzaChbZ3JheSwgZ3JheSwgZ3JheSwgMV0pXHJcblx0XHR9XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRhcnIsXHJcblx0XHRcdGdyYXlBcnJcclxuXHRcdH1cclxuXHR9XHJcblx0c2V0R3JheUltYWdlKCkge1xyXG5cdFx0bGV0IGltYWdlRGF0YSA9IHRoaXMuY3h0LmdldEltYWdlRGF0YSh0aGlzLngsIHRoaXMueSwgdGhpcy5pbWdfd2lkdGgsIHRoaXMuaW1nX2hlaWdodClcclxuXHRcdGxldCBkYXRhID0gaW1hZ2VEYXRhLmRhdGFcclxuXHRcdGxldCBsZW4gPSBpbWFnZURhdGEuZGF0YS5sZW5ndGhcclxuXHRcdGxldCBhcnIgPSBbXVxyXG5cdFx0bGV0IGdyYXlBcnIgPSBbXVxyXG5cdFx0Ly/ov7fkuYvkuI3nm7jnrYnvvJ9cclxuXHRcdGlmIChpbWFnZURhdGEud2lkdGggIT09IHRoaXMuaW1nX3dpZHRoKSB0aGlzLmltZ193aWR0aCA9IGltYWdlRGF0YS53aWR0aFxyXG5cdFx0aWYgKGltYWdlRGF0YS5oZWlnaHQgIT09IHRoaXMuaW1nX2hlaWdodCkgdGhpcy5pbWdfaGVpZ2h0ID0gaW1hZ2VEYXRhLmhlaWdodFxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW4gLyA0OyBpKyspIHtcclxuXHRcdFx0bGV0IGdyYXkgPSBwYXJzZUludCgoZGF0YVtpICogNF0gKyBkYXRhW2kgKiA0ICsgMV0gKyBkYXRhW2kgKiA0ICsgMl0pIC8gMylcclxuXHRcdFx0ZGF0YVtpICogNF0gPSBkYXRhW2kgKiA0ICsgMV0gPSBkYXRhW2kgKiA0ICsgMl0gPSBncmF5XHJcblx0XHR9XHJcblx0XHR0aGlzLmN4dC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcclxuXHR9XHJcbn0iXX0=
