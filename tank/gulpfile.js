var gulp = require('gulp'),
  nodemon = require('gulp-nodemon');

var browserSync = require('browser-sync').create();
// var reload = browserSync.reload;

//  browser-sync同步调试
gulp.task('browser-sync',['server'], function() {
  var files = [
  './views/*.ejs',
  './public/css/*.css',
  './public/js/*.js',
  './public/Map_Tool/*.json',
  './bin/www'
  ];

  browserSync.init(null, {
    proxy: 'http://localhost:3000',
    files: files,
    browser: 'google chrome',
    notify: false,
    port: 8080
  });
});

//  nodemon开启node服务器
gulp.task('server', function(cb) {
  var first = false;

  return nodemon({
    script: './bin/www'
  }).on('start', function () {
    if (!first) {
      cb();
      first = true;
    }
  });
});

//  gulp默认开启调试工作
gulp.task('default', ['browser-sync']);