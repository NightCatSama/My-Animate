var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gulpif = require('gulp-if'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    csscomb = require('gulp-csscomb'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    changed = require('gulp-changed'),
    debug = require('gulp-debug'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    webpack = require('gulp-webpack'),
    cache = require('gulp-cache'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    clean = require('gulp-clean'),
    browserSync = require('browser-sync').create();

var reload = browserSync.reload;
var isDeploy = false;

// 静态服务器
gulp.task('browser-sync', ['sass', 'scripts', 'images'], function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 3030
    });

    watch();
});

// 监听文件变化
function watch() {
    gulp.watch('src/styles/**/*.scss', ['sass']);
    gulp.watch('src/javascripts/**/*.js', ['scripts']);
    gulp.watch(['src/images/**/*.png', 'src/images/**/*.jpg', 'src/images/**/*.jpeg'], ['images']);
    gulp.watch(['index.html', 'views/*.html']).on('change', reload);
    gulp.watch('dist/javascripts/bundle.js').on('change', reload);
    gulp.watch('dist/stylesheets/**/*.css').on('change', reload);
}

// 样式处理
gulp.task('sass', function() {
    return gulp.src('src/styles/**/*.scss')
        .pipe(changed('dist/stylesheets', { extension: '.css' }))
        .pipe(plumber({
            errorHandler: function(error) {
                this.emit('end');
            }
        }))
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'SASS编译失败！',
                message: `<%= error.messageOriginal %>（<%= error.line %>行）`
            })
        }))
        .pipe(gulpif(!isDeploy, sourcemaps.init()))
        .pipe(sass())
        .pipe(gulpif(!isDeploy, sourcemaps.write()))
        .pipe(autoprefixer(['>5%']))
        .pipe(csscomb())
        .pipe(gulp.dest('dist/stylesheets'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCSS())
        .pipe(debug({title: '编译:'}))
        .pipe(gulp.dest('dist/stylesheets'))
        // .pipe(notify({ message: 'sass编译成功！' }))
});

// Scripts任务 (ES6 打包模式)
gulp.task('scripts', function() {
    return gulp.src('src/javascripts/**/*.js')
        // .pipe(changed('dist/javascripts'))
        .pipe(plumber({
            errorHandler: function(error) {
                this.emit('end');
            }
        }))
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Javascript编译失败！',
                message: `<%= error.message %>`
            })
        }))
        .pipe(gulpif(!isDeploy, sourcemaps.init()))
        .pipe(babel())
        // .pipe(concat('all.js'))  //代码合并
        .pipe(debug({title: '编译:'}))
        .pipe(gulp.dest('dist/javascripts'))
        .pipe(webpack({
            devtool: 'source-map',
            output:{
                filename: 'bundle.js',
            },
            stats:{
                colors:true
            }
        }))
        .pipe(gulpif(!isDeploy, sourcemaps.write()))
        .pipe(gulp.dest('dist/javascripts'));//包装好的js目录
        // .pipe(notify({ message: 'Javascript编译成功！' }))
        // .pipe(reload({stream: true}))
});

// Scripts任务 (多文件)
// gulp.task('scripts', function() {
//     return gulp.src('src/javascripts/**/*.js')
//         .pipe(changed('dist/javascripts'))
//         .pipe(plumber({
//             errorHandler: function(error) {
//                 this.emit('end');
//             }
//         }))
//         .pipe(plumber({
//             errorHandler: notify.onError({
//                 title: 'Javascript编译失败！',
//                 message: `<%= error.message %>`
//             })
//         }))
//         .pipe(sourcemaps.init())
//         .pipe(gulpif(!isDeploy, sourcemaps.init()))
//         .pipe(babel())
//         .pipe(uglify())
//         // .pipe(concat('all.js'))  //代码合并
//         .pipe(gulpif(!isDeploy, sourcemaps.write()))
//         .pipe(debug({title: '编译:'}))
//         .pipe(gulp.dest('dist/javascripts'));
//         // .pipe(notify({ message: 'Javascript编译成功！' }))
//         // .pipe(reload({stream: true}))
// });

// 图片压缩
gulp.task('images', function() {
    return gulp.src('src/images/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({
            message: '图片压缩完成！'
        }));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['./dist/stylesheets', './dist/javascripts', './dist/images'], {
            read: false
        })
        .pipe(clean());
});

gulp.task('isDev', function() {
    isDeploy = false;
});

gulp.task('isDeploy', function() {
    isDeploy = true;
});

// 开发环境
gulp.task('default', ['isDev', 'browser-sync']);

// 生产环境
gulp.task('deploy', ['isDeploy', 'sass', 'scripts', 'images']);