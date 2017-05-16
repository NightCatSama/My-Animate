(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['./canvas.js'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('./canvas.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.canvas);
    global.index = mod.exports;
  }
})(this, function (_canvas) {
  'use strict';

  var _canvas2 = _interopRequireDefault(_canvas);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  new _canvas2.default('canvas', {
    clickPause: true
  });
});