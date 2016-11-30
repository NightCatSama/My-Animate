(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['canvas'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('canvas'));
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

  var canvas = new _canvas2.default(document.getElementById('canvas'), {});
  canvas.setImage('dist/images/3.jpg');
  canvas.setImage('dist/images/2.jpg', 'colors');
});