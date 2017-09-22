'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var paths = {
  lint: ['./gulpfile.js', './lib/**/*.js', './test/**/*.js'],
  watch: ['./gulpfile.js', './lib/**', './test/**/*.js',
    '!test/{temp,temp/**}'],
  tests: ['./test/**/*.js', '!test/{temp,temp/**}'],
};

gulp.task('lint', function() {
  return gulp.src(paths.lint)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('pre-test', function() {
  return gulp.src(['lib/**/*.js'], {cwd: __dirname})
    // Covering files
    .pipe(plugins.istanbul())
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire());
});

gulp.task('test', gulp.series('pre-test', function() {
  return gulp.src(paths.tests, {cwd: __dirname})
    .pipe(plugins.mocha())
    // Creating the reports after tests ran
    .pipe(plugins.istanbul.writeReports());
}));

gulp.task('coveralls', function() {
  return gulp.src('coverage/lcov.info')
    .pipe(plugins.coveralls());
});

gulp.task('watch', gulp.series('test', function() {
  gulp.watch(paths.watch, ['test']);
}));

gulp.task('default', gulp.series(['test', 'coveralls', 'lint']));
