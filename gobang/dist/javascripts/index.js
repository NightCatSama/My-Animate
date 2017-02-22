(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['./Chess.js'], factory);
	} else if (typeof exports !== "undefined") {
		factory(require('./Chess.js'));
	} else {
		var mod = {
			exports: {}
		};
		factory(global.Chess);
		global.index = mod.exports;
	}
})(this, function (_Chess) {
	'use strict';

	var _Chess2 = _interopRequireDefault(_Chess);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var c = new _Chess2.default(document.getElementById('checkerboard'), {
		cb: gameover
	});

	var bValue = c.player;
	Object.defineProperty(c, 'player', {
		get: function get() {
			return bValue;
		},
		set: function set(newValue) {
			changePlayer(newValue);
			bValue = newValue;
		},
		enumerable: true,
		configurable: true
	});

	function changePlayer(player) {
		document.getElementById('control').textContent = '\u5F53\u524D\u73A9\u5BB6\uFF1A' + (player ? '白棋' : '黑旗');
	}

	function gameover(result) {
		document.getElementById('control').textContent = result;
	}

	changePlayer(bValue);
});