import gulp from 'gulp';
import path from 'path';
import sync from 'browser-sync';
import sass from 'gulp-sass'; //SASS
import handlebars from 'gulp-handlebars'; //HANDLEBARS BEGIN
import wrap from 'gulp-wrap';
import declare from 'gulp-declare';
import concat from 'gulp-concat';
import merge from 'merge-stream'; //HANDLEBARS END
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';
import pxtorem from 'postcss-pxtorem';
import postcss from 'gulp-postcss';

var processors = [
  pxtorem({
      replace: false,
      propWhiteList: []
  })
];

// sync = sync.create();
gulp.task('scss', function() {
  return gulp.src('src/styles/scss/style.scss')
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist/styles'))
    .pipe(sync.stream());
});

gulp.task('babelify', function() {
  var bundler = browserify('src/js/app/main.js');
    bundler.transform(babelify);
    bundler.bundle()
      .on('error', function (err) { console.error(err); })
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(uglify()) // Use any gulp plugins you want now
      .pipe(gulp.dest('dist/scripts'));
});

gulp.task('compile-templates', function() {
  var partials = gulp.src(['src/templates/partials/*.hbs'])
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
      imports: {
        processPartialName: function(fileName) {
          return JSON.stringify(path.basename(fileName, '.js'));
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

gulp.task('sync', ['scss', 'compile-templates', 'babelify'], function() {
  sync.init({
    server: './'
  });
  gulp.watch("src/styles/scss/**/*.scss", ['scss']);
  gulp.watch('src/templates/**/*.hbs', ['compile-templates']);
  gulp.watch('src/js/app/*.js', ['babelify']);
});

gulp.task('default', ['sync'], function() {
  console.log('hello ! gulp is launched');
});
