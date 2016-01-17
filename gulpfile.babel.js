var gulp = require('gulp')
var gutil = require('gulp-util')
var connect = require('gulp-connect')
var browserify = require('browserify')
var source = require('vinyl-source-stream')

gulp.task('connect', function () {
  connect.server({
    root: 'public',
    port: 4000
  })
})

gulp.task('browserify', function() {
  // Grabs the app.js file
    return browserify('./app/app.js')
      // bundles it and creates a file called main.js
        .bundle().on('error', gutil.log)
        .pipe(source('main.js').on('error', gutil.log))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./public/js/'));
})

gulp.task('sass', function() {
  return sass('sass/style.sass')
    .pipe(gulp.dest('public/css'))
})

gulp.task('watch', function() {
  gulp.watch('app/**/*.js', ['browserify'])
})

gulp.task('default', ['connect', 'watch'])