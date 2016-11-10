 var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sync = require('browser-sync').create(),
    handlebars = require('gulp-handlebars'),
    wrap = require('gulp-wrap'),
    declare = require('gulp-declare'),
    concat = require('gulp-concat'),
    merge = require('merge-stream');

gulp.task('scss', function() {
  return gulp.src('src/styles/scss/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/styles'))
    .pipe(sync.stream());
});

gulp.task('compile-templates', function() {
  var partials = gulp.src(['src/templates/partials/*.hbs'])
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
      imports: {
        processPartialName: function(fileName) {
          return JSON.stringify(path.basename(fileName, 'js'));
        }
      }
    }));

  var templates = gulp.src(['src/templates/pages/*.hbs'])
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'MyApp.templates',
      noRedeclare: true
    }));

  return merge(partials, templates)
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('sync', ['scss', 'compile-templates'], function() {
  sync.init({
    server: './'
  });
  gulp.watch("src/styles/scss/**/*.scss", ['scss']);
  gulp.watch('src/templates/**/*.hbs', ['compile-templates']);
});

gulp.task('default', ['sync'], function() {
  console.log('hello ! gulp is launched');
});
