(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['index'], factory);
    } else if (typeof exports !== "undefined") {
        factory(require('index'));
    } else {
        var mod = {
            exports: {}
        };
        factory(global.index);
        global.config = mod.exports;
    }
})(this, function () {
    'use strict';

    requirejs.config({
        baseUrl: 'dist/javascripts'
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlanMiLCJjb25maWciLCJiYXNlVXJsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsY0FBVUMsTUFBVixDQUFpQjtBQUNiQyxpQkFBUztBQURJLEtBQWpCIiwiZmlsZSI6ImNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmVqcy5jb25maWcoe1xyXG4gICAgYmFzZVVybDogJ2Rpc3QvamF2YXNjcmlwdHMnXHJcbn0pO1xyXG5cclxuaW1wb3J0ICdpbmRleCc7Il19
