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

gulp.task('test', function () {
  gulp.src(paths.tests, {cwd: __dirname})
    .pipe(plugins.plumber(plumberConf))
    .pipe(plugins.coverage.instrument({
      pattern: ['lib/**/*.js'],
      debugDirectory: 'debug'
    }))
    .pipe(plugins.mocha())
    .pipe(plugins.coverage.gather())
    .pipe(plugins.coverage.format())
    .pipe(gulp.dest('reports'));
});

gulp.task('watch', ['test'], function () {
  gulp.watch(paths.watch, ['test']);
});


gulp.task('default', ['test', 'lint']);
