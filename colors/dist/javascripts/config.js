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