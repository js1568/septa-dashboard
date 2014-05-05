var jshint = require('gulp-jshint'),
  jscs = require('gulp-jscs'),
  gulp = require('gulp');

gulp.task('lint', function() {
  gulp.src('./client/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(jscs('./client/js/.jscsrc'));
});

gulp.task('default', ['lint']);