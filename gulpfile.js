 var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sync = require('browser-sync').create();

gulp.task('scss', function() {
  return gulp.src('src/styles/scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/styles/css'))
        .pipe(sync.stream());
});

gulp.task('sync', ['scss'], function() {
  sync.init({
    server: './'
  });
  gulp.watch("src/styles/scss/**/*.scss", ['scss']);
});

gulp.task('default', ['sync'], function() {
  console.log('hello !');
});
