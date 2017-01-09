'use strict';

var gulp   = require('gulp');
var plugins = require('gulp-load-plugins')();

var paths = {
  lint: ['./gulpfile.js', './lib/**/*.js'],
  watch: ['./gulpfile.js', './lib/**', './test/**/*.js', '!test/{temp,temp/**}'],
  tests: ['./test/**/*.js', '!test/{temp,temp/**}']
};

var plumberConf = {};

if (process.env.CI) {
  plumberConf.errorHandler = function(err) {
    throw err;
  };
}

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.plumber(plumberConf))
    .pipe(plugins.jscs())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('pre-test', function () {
  return gulp.src(['lib/**/*.js'], {cwd: __dirname})
    // Covering files
    .pipe(plugins.istanbul())
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  gulp.src(paths.tests, {cwd: __dirname})
    .pipe(plugins.plumber(plumberConf))
    .pipe(plugins.mocha())
    // Creating the reports after tests ran
    .pipe(plugins.istanbul.writeReports())
});

gulp.task('coveralls', function () {
  gulp.src('coverage/lcov.info')
    .pipe(plugins.coveralls());
});

gulp.task('watch', ['test'], function () {
  gulp.watch(paths.watch, ['test']);
});


gulp.task('default', ['test', 'coveralls', 'lint']);
