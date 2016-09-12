
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    flatten = require('gulp-flatten'),
    browserSync = require('browser-sync'),
    config = require('./config'),
    nodemon = require('gulp-nodemon');


gulp.task('default', ['clean-folder'], function () {
	gulp.start(['components', 'views', 'style', 'scripts', 'images', 'browser-sync', 'watch']);
});
//browser-sync
gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: config.host + ':' + config.port,
		port: 7000
	});
});
//nodemon
gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: 'server/app.js',
		ignore: 'dist/'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true;
		}
	});
});

//clean
gulp.task('clean-folder', function() {
  return gulp.src('./dist/', {read: false})
    .pipe(clean());
});
// Views task
gulp.task('views', function() {
	gulp.src('./client/index.html')
    .pipe(gulp.dest('dist/'));
  // Any other view files from app, will be put in the dist/views folder
  return gulp.src(['./client/**/**/*.html', '!./client/index.html'])
    .pipe(flatten({ includeParents: -1} ))
    .pipe(gulp.dest('dist/views/'))
    .pipe(browserSync.stream());;
});
//Components
gulp.task('components', function() {
  // Get components and put it in the dist folder
  return gulp.src('bower_components/**/**/*')
    .pipe(gulp.dest('dist/components'));
});
//Components
gulp.task('images', function() {
  // Get components and put it in the dist folder
  return gulp.src('./client/assets/img/*')
    .pipe(gulp.dest('dist/assets/img'));
});
//watch
gulp.task('watch', function() {
  //watch html
  gulp.watch(['./client/index.html', './client/**/**/*.html'], ['views']);
  //watch css
  gulp.watch(['./client/**/**/*.styl'], ['style']);
  //watch js
  gulp.watch(['./client/**/**/*.js'], ['scripts']);
});
//stylus
gulp.task('style', function() {
  return gulp.src('./client/app.styl')
    .pipe(stylus({
      compress: true,
      use: [ nib() ]
    }))
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(browserSync.stream());
});
//js
gulp.task('scripts', function() {
  return gulp.src('./client/**/**/*.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});
