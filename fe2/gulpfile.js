var gulp = require('gulp')
var g_if = require('gulp-if')
var react = require('gulp-react')
var less = require('gulp-less')
var cssmin = require('gulp-cssmin')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var imagemin = require('gulp-imagemin')
var sourcemaps = require('gulp-sourcemaps')
var connect = require('gulp-connect')
var source = require('vinyl-source-stream')
var browserify = require('browserify')
var reactify = require('reactify')
var del = require('del')

var paths = {
    build: 'build/',
    main: ['./js/main.js'],
    js: ['js/**/*.js', 'js/**/*.jsx'],
    js_lib: ['abalone-js/abalone.js', 'abalone-js/bower_components/d3/d3.js'],
    img: ['static/**/*.png'],
    css: ['less/**/*.less', 'abalone-js/abalone.css'],
    html: ['html/**/*.html'],
}

gulp.task('clean', function(cb) {
    del([paths.build], cb)
})

gulp.task('js-main', function() {
    return browserify(paths.main)
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.min.js'))
        .pipe(gulp.dest('build/static'))
})

gulp.task('js-libs', function() {
    return gulp.src(paths.js_lib)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('build/static'))
})

gulp.task('css', function() {
    return gulp.src(paths.css)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(cssmin())
        .pipe(concat('bundle.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/static'))
})

gulp.task('img', function() {
    return gulp.src(paths.img)
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest('build/static'))
        .pipe(connect.reload())
})

gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest('build/'))
})

gulp.task('watch', function() {
    gulp.watch(paths.js, ['js-main'])
    gulp.watch(paths.js_lib, ['js-libs'])
    gulp.watch(paths.css, ['css'])
    gulp.watch(paths.img, ['img'])
    gulp.watch(paths.html, ['html'])
})

gulp.task('server', function() {
    connect.server({
        root: 'build',
        fallback: 'build/index.html',
        port: 8000,
        livereload: true
    })
})

gulp.task('default', ['watch', 'js-main', 'js-libs', 'css', 'img', 'html', 'server'])
gulp.task('compile', ['js-main', 'js-libs', 'css', 'img', 'html'])
