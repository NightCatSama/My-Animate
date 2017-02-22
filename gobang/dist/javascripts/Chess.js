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
		global.Chess = mod.exports;
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
		size: 600, // 棋盘大小
		shrink: 5, //  棋子大小 = 一格大小 - shrink
		color: ['#000', '#FFF'], // 玩家1 玩家2 颜色
		bg_texture: 'dist/images/wood.png' //  背景纹理
	};

	var Chess = function () {
		function Chess(el, options) {
			_classCallCheck(this, Chess);

			Object.assign(this, _default, options);
			this.checkerboard = el;
			this.cxt = this.checkerboard.getContext('2d');
			this.gap = this.size / 15;

			this.ignores = [];
			this.getMousePos = this.getMousePos.bind(this);
			this.bindEvent();
			this.init();
		}
		/*  绑定事件  */


		_createClass(Chess, [{
			key: 'bindEvent',
			value: function bindEvent() {
				this.checkerboard.addEventListener('click', this.getMousePos);
			}
		}, {
			key: 'unbindEvent',
			value: function unbindEvent() {
				this.checkerboard.removeEventListener('click', this.getMousePos);
			}
		}, {
			key: 'init',
			value: function init() {
				this.cxt.clearRect(0, 0, this.size, this.size);
				this.initSize();
				this.player = 0;
				this.piece_count = 0;
				this.over = false;
				this.pieces = [];
				this.pieces0 = [];
				this.pieces1 = [];
				this.setBg();
			}
		}, {
			key: 'initSize',
			value: function initSize() {
				this.checkerboard.width = this.size;
				this.checkerboard.height = this.size;
				this.bounds = this.checkerboard.getBoundingClientRect();
			}
		}, {
			key: 'setBg',
			value: function setBg() {
				var _this = this;

				this.cxt.clearRect(0, 0, this.size, this.size);

				this.image = new Image();
				this.image.onload = function () {
					_this.cxt.fillStyle = _this.cxt.createPattern(_this.image, 'repeat');
					_this.cxt.fillRect(0, 0, _this.size, _this.size);
					_this.createGridding();
				};

				this.image.src = this.bg_texture;
			}
		}, {
			key: 'createGridding',
			value: function createGridding() {
				this.cxt.strokeStyle = '#000';
				this.cxt.lineWidth = 1;
				for (var x = 0; x < 15; x++) {
					this.cxt.moveTo(x * this.gap + this.gap / 2, this.gap / 2);
					this.cxt.lineTo(x * this.gap + this.gap / 2, this.size - this.gap / 2);
					this.cxt.moveTo(this.gap / 2, x * this.gap + this.gap / 2);
					this.cxt.lineTo(this.size - this.gap / 2, x * this.gap + this.gap / 2);
					this.cxt.stroke();
				}
			}
		}, {
			key: 'getMousePos',
			value: function getMousePos(e) {
				if (this.over) return this.init();
				var mx = e.clientX - this.bounds.left;
				var my = e.clientY - this.bounds.top;
				this.checked(~~(mx / this.gap), ~~(my / this.gap));
			}
		}, {
			key: 'callback',
			value: function callback(word) {
				alert(word);
				this.cb && this.cb(word);
			}
		}, {
			key: 'checked',
			value: function checked(x, y) {
				var _this2 = this;

				var index = this.getIndex(x, y);
				if (this.pieces.indexOf(index) > -1) return false;
				this.pieces.push(index);
				this['pieces' + this.player].push(index);
				this.createPiece(x, y, index);
				this.isWin(index);
				if (!this.over) {
					this.player = +!this.player;
				} else {
					return setTimeout(function () {
						return _this2.callback((_this2.player ? '白' : '黑') + '\u68CB\u83B7\u5F97\u4E86\u80DC\u5229!');
					});
				}
				this.piece_count++;
				if (this.piece_count === 225) {
					return setTimeout(function () {
						return _this2.callback('\u548C\u68CB!');
					});
				}
			}
		}, {
			key: 'createPiece',
			value: function createPiece(x, y, index) {
				this.cxt.fillStyle = this.color[this.player];
				this.cxt.shadowColor = '#000';
				this.cxt.shadowBlur = 5;

				this.cxt.beginPath();
				this.cxt.arc(x * this.gap + this.gap / 2, y * this.gap + this.gap / 2, (this.gap - this.shrink) / 2, 0, 2 * Math.PI, true);
				this.cxt.closePath();

				this.cxt.fill();
			}
		}, {
			key: 'isWin',
			value: function isWin(index) {
				var lines = {
					's': [index],
					'h': [index],
					't': [index],
					'd': [index]
				};
				this.typeLine = this.createTypeLine(index);
				this.setLines(index, lines);
				for (var type in lines) {
					/*  其中一条线大于等于5个就赢了  */
					if (lines[type].length >= 5) {
						this.over = true;
					}
				}
				this.ignores = [];
			}
		}, {
			key: 'setLines',
			value: function setLines(index, lines, haveType) {
				var _this3 = this;

				var indexs = this.getIndexs(index, haveType);
				Array.from(indexs, function (p) {
					var type = _this3.getType(index, p);
					lines[type].push(p);
					_this3.setLines(p, lines, type);
				});
			}
		}, {
			key: 'getIndexs',
			value: function getIndexs(index, type) {
				var _this4 = this;

				this.ignores.push(index);
				var x = index % 15;
				var y = ~~(index / 15);
				var xs = [x - 1, x, x + 1];
				var ys = [y - 1, y, y + 1];

				var n = [];
				Array.from(xs, function (i) {
					Array.from(ys, function (j) {
						if (i < 0 || j < 0) return;
						var p = j * 15 + i;
						if (_this4.isEnable(p, type)) {
							n.push(p);
						}
					});
				});
				return n;
			}
		}, {
			key: 'isEnable',
			value: function isEnable(index, type) {
				if (this.ignores.indexOf(index) > -1) return false;

				if (type && this.typeLine[type].indexOf(index) === -1) return false;

				this.ignores.push(index);
				if (this['pieces' + this.player].indexOf(index) > -1) return true;

				return false;
			}
		}, {
			key: 'createTypeLine',
			value: function createTypeLine(index) {
				var maps = {
					s: 15,
					h: 1,
					d: 16,
					t: 14
				};
				var obj = {
					's': [index],
					'h': [index],
					't': [index],
					'd': [index]
				};
				var pos = this.getXY(index);
				var x = pos.x;
				var y = pos.y;
				for (var type in maps) {
					obj[type] = this.getOneTypeLine(type, x, y);
				}
				return obj;
			}
		}, {
			key: 'getOneTypeLine',
			value: function getOneTypeLine(type, x, y) {
				var arr = [];
				var bx = x;
				var by = y;
				while (x >= 0 && y >= 0 && x <= 14 && y <= 14) {
					arr.push(this.getIndex(x, y));
					switch (type) {
						case 's':
							y += 1;break;
						case 'h':
							x += 1;break;
						case 'd':
							x += 1;y += 1;break;
						case 't':
							x += 1;y -= 1;break;
					}
				}
				x = bx;
				y = by;
				while (x >= 0 && y >= 0 && x <= 14 && y <= 14) {
					arr.push(this.getIndex(x, y));
					switch (type) {
						case 's':
							y -= 1;break;
						case 'h':
							x -= 1;break;
						case 'd':
							x -= 1;y -= 1;break;
						case 't':
							x -= 1;y += 1;break;
					}
				}
				return arr.slice(1);
			}
		}, {
			key: 'getType',
			value: function getType(index, p) {
				var maps = {
					15: 's',
					1: 'h',
					16: 'd',
					14: 't'
				};
				return maps[Math.abs(index - p)]; //  's'竖, 'h'横, 't'上升线, 'd'下降线 
			}
		}, {
			key: 'getXY',
			value: function getXY(index) {
				return {
					x: index % 15,
					y: ~~(index / 15)
				};
			}
		}, {
			key: 'getIndex',
			value: function getIndex(x, y) {
				return y * 15 + x;
			}
		}]);

		return Chess;
	}();

	exports.default = Chess;
	;
});