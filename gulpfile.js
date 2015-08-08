var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');
var del = require('del');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
//var api = require('./api/api');


var reload = browserSync.reload;

// cache a reference to watchify
var bundler = _.memoize(function(watch) {
  var options = {debug: true};
  if (watch) {
    _.extend(options, watchify.args);
  }
  var b = browserify('./client/index.js', options);
  if (watch) {
    b = watchify(b);
  }
  return b;
});


function bundle(cb, watch) {
  return bundler(watch).bundle()
    .on('error', handleError('bundler'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'))
    .on('end', cb)
    .pipe(reload({ stream: true }));
}


var handleError = function(task) {
  return function(err) {
    $.util.log($.util.colors.bgRed(task + ' errorz:'), $.util.colors.red(err));
  };
};


// var handleError = function(task) {
//   return function(err) {

//       notify.onError({
//         message: task + ' failed, check the logs..',
//         sound: false
//       })(err);
    
//     gutil.log(gutil.colors.bgRed(task + ' errorz:'), gutil.colors.red(err));
//   };
// };



// put html into dist
gulp.task('html', function() {
  return gulp.src('./client/index.html')
    .pipe($.plumber())
    .pipe(gulp.dest('./dist'))
    .pipe(reload({ stream: true}));
});

// bundle css into one file & put in dist
gulp.task('styles', function() {
  return gulp.src('./client/main.less')
    .pipe($.less())
    .pipe($.autoprefixer())
    .pipe($.rename('bundle.css'))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(reload({ stream: true }));
});

gulp.task('jshint', function() {
  return gulp.src(['./client/**/*.js', './test/**/*.js'])
    .pipe($.plumber())
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish));
});

gulp.task('scripts', function(cb) {
  process.env.BROWSERIFYSWAP_ENV = 'dist';
  bundle(cb, true);
});

gulp.task('lint', function() {
  return gulp.src([
      'gulpfile.js',
      './client/index.js',
      './client/**/*.js'
    ]).pipe($.jshint())
    .pipe($.jshint.reporter($.stylish))
    .on('error', function() {
      $.gutil.log($.util.colors.bgRed('ERROR'));
    });
});

gulp.task('test', [
  'jshint',
  //'mocha'
]);

gulp.task('clean', function(cb) {
  del([
    'app/tmp'
  ], cb);
});

gulp.task('build', [
  'clean',
  'html',
  'styles',
  'scripts'
]);

gulp.task('watch', ['build'], function(cb) {
  browserSync({
    server: {
      baseDir: 'dist'
    //   middleware: function(req, res, next) {
    //     api(req, res, next);
    //   }
    },
    port: process.env.PORT || 3000
  });

  reporter = 'dot';
  bundler(true).on('update', function() {
    gulp.start('scripts');
    //gulp.start('test');
  });
  //gulp.watch('./tes/**/*.js', ['test']);
  gulp.watch(['./client/**/*.less'], ['styles']);
  gulp.watch(['./client/*.html'], ['html']);
});


gulp.task('default', ['watch']);