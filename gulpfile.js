var watchify = require('watchify'),
    browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    assign = require('lodash.assign'),
    rename = require('gulp-rename'),
    babelify = require('babelify'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    exit = require('gulp-exit');

var customOpts = {
  entries : ['./app/app.js'],
  debug: true,
  transform: [babelify]
};

var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

gulp.task('js', bundle);
b.on('update', bundle);
b.on('log',gutil.log);

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('./src/app.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(gutil.env.type === 'production' ? uglify({ mangle: false }) : gutil.noop())
    .pipe(rename({
        dirname: ''
    }))
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./public/js'))
    .pipe(gutil.env.type === 'production' ? exit() : gutil.noop());
}    

gulp.task('connect', function () {
  connect.server({
    root: 'public',
    port: 4000
  })
})


gulp.task('watch', function() {
  gulp.watch('app/**/*.js', ['browserify'])
})

gulp.task('default', ['connect', 'watch', 'js']);