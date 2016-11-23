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
  canvas.setImage('dist/images/1.jpg');
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImNhbnZhcyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzZXRJbWFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFJQSxTQUFTLHFCQUFXQyxTQUFTQyxjQUFULENBQXdCLFFBQXhCLENBQVgsRUFBOEMsRUFBOUMsQ0FBYjtBQUVBRixTQUFPRyxRQUFQLENBQWdCLG1CQUFoQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYW52YXMgZnJvbSAnY2FudmFzJztcclxuXHJcbnZhciBjYW52YXMgPSBuZXcgQ2FudmFzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSwge1xyXG59KTtcclxuY2FudmFzLnNldEltYWdlKCdkaXN0L2ltYWdlcy8xLmpwZycpIl19
