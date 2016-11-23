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
  canvas.setImage('../src/images/img.jpg');
  // canvas.setImage('../src/images/3.jpg', 'colors')
  // setTimeout(() => {
  // 	canvas.mask.addWave(50, 50)
  // }, 5000)
  // canvas.start()
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImNhbnZhcyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzZXRJbWFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFJQSxTQUFTLHFCQUFXQyxTQUFTQyxjQUFULENBQXdCLFFBQXhCLENBQVgsRUFBOEMsRUFBOUMsQ0FBYjtBQUVBRixTQUFPRyxRQUFQLENBQWdCLHVCQUFoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FudmFzIGZyb20gJ2NhbnZhcyc7XHJcblxyXG52YXIgY2FudmFzID0gbmV3IENhbnZhcyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyksIHtcclxufSk7XHJcbmNhbnZhcy5zZXRJbWFnZSgnLi4vc3JjL2ltYWdlcy9pbWcuanBnJylcclxuLy8gY2FudmFzLnNldEltYWdlKCcuLi9zcmMvaW1hZ2VzLzMuanBnJywgJ2NvbG9ycycpXHJcbi8vIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4vLyBcdGNhbnZhcy5tYXNrLmFkZFdhdmUoNTAsIDUwKVxyXG4vLyB9LCA1MDAwKVxyXG4vLyBjYW52YXMuc3RhcnQoKSJdfQ==
