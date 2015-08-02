'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');


var notify = require('gulp-notify');

var buffer = require('vinyl-buffer');
var argv = require('yargs').argv;
// sass
//var sass = require('gulp-sass');
// var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var rename = require('gulp-rename');
var less = require('gulp-less');
// var sourcemaps = require('gulp-sourcemaps');
//var minifyCss = require('gulp-minify-css');
// BrowserSync
var browserSync = require('browser-sync');
// js
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
// image optimization
var imagemin = require('gulp-imagemin');
// linting
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
// testing/mocha
var mocha = require('gulp-mocha');

// gulp build --production
var production = !!argv.production;
// determine if we're doing a build
// and if so, bypass the livereload
var build = argv._.length ? argv._[0] === 'build' : false;
var watch = argv._.length ? argv._[0] === 'watch' : true;

//process.env.BROWSERIFYSHIM_DIAGNOSTICS=0;



// ----------------------------
// Error notification methods
// ----------------------------
var handleError = function(task) {
  return function(err) {

      notify.onError({
        message: task + ' failed, check the logs..',
        sound: false
      })(err);
    
    gutil.log(gutil.colors.bgRed(task + ' errorz:'), gutil.colors.red(err));
  };
};
// --------------------------
// CUSTOM TASK METHODS
// --------------------------
var tasks = {
  // --------------------------
  // Delete build folder
  // --------------------------
  clean: function(cb) {
    del(['dist/'], cb);
  },
  // --------------------------
  // Copy static assets
  // --------------------------
  assets: function() {
    return gulp.src('./client/assets/**/*')
      .pipe(gulp.dest('dist/assets/'));
  },
  // --------------------------
  // HTML
  // --------------------------
  // html templates (when using the connect server)
  templates: function() {
    gulp.src(['./client/templates/*.html', './client/*.html'])
      .pipe(gulp.dest('dist/'));
  },
  // --------------------------
  // SASS (libsass)
  // --------------------------
  // sass: function() {
  //   return gulp.src('./client/scss/*.scss')
  //     // sourcemaps + sass + error handling
  //     .pipe(gulpif(!production, sourcemaps.init()))
  //     .pipe(sass({
  //       sourceComments: !production,
  //       outputStyle: production ? 'compressed' : 'nested'
  //     }))
  //     .on('error', handleError('SASS'))
  //     // generate .maps
  //     .pipe(gulpif(!production, sourcemaps.write({
  //       'includeContent': false,
  //       'sourceRoot': '.'
  //     })))
  //     // autoprefixer
  //     .pipe(gulpif(!production, sourcemaps.init({
  //       'loadMaps': true
  //     })))
  //     .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
  //     // we don't serve the source files
  //     // so include scss content inside the sourcemaps
  //     .pipe(sourcemaps.write({
  //       'includeContent': true
  //     }))
  //     // write sourcemaps to a specific directory
  //     // give it a file and save
  //     .pipe(gulp.dest('dist/css'));
  // },
  // --------------------------
  // LESS
  // --------------------------
  less: function() {
    return gulp.src('./client/main.less')
      //.pipe(autoprefixer({browsers: ['last 2 versions']}))
      .pipe(less())
      //.pipe(autoprefixer())
      .pipe(rename('bundle.css'))
      .on('error', handleError('LESS'))
      .pipe(gulp.dest('./dist/styles'));
  },
  
  
  // var minifyCss = require('gulp-minify-css');
  // var sourcemaps = require('gulp-sourcemaps');

  // gulp.task('minify-css', function() {
  //   return gulp.src('./src/*.css')
  //     .pipe(sourcemaps.init())
  //     .pipe(minifyCss())
  //     .pipe(sourcemaps.write())
  //     .pipe(gulp.dest('dist'));
  // });
  
  
  // gulp.task('minify', function () {
  //   gulp.src('foo.css')
  //       .pipe(minify({keepBreaks: true}))
  //       .pipe(concat('foo.min.css'))
  //       .pipe(gulp.dest('./'))
  // });
  
  
  // --------------------------
  // Browserify
  // --------------------------
  browserify: function() {
    var bundler = browserify('./client/index.js', {
      debug: false,
      cache: {}
    });
    // determine if we're doing a build
    // and if so, bypass the livereload
    var build = argv._.length ? argv._[0] === 'build' : false;
    if (watch) {
      bundler = watchify(bundler);
    }
    var rebundle = function() {
      return bundler.bundle()
        .on('error', handleError('Browserify'))
        .pipe(source('build.js'))
        .pipe(gulpif(production, buffer()))
        .pipe(gulpif(production, uglify()))
        .pipe(gulp.dest('./dist/js'))
        .on('end', function() {
          
          gutil.log(gutil.colors.bgGreen('bundle completo'));
          
        });

    };
    bundler.on('update', rebundle);
    return rebundle();
  },
  // --------------------------
  // linting
  // --------------------------
  lintjs: function() {
    return gulp.src([
        'gulpfile.js',
        './client/index.js',
        './client/**/*.js'
      ]).pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .on('error', function() {
        gutil.log(gutil.colors.bgRed('ERROR'));
      });
  },
  // --------------------------
  // Optimize asset images
  // --------------------------
  optimize: function() {
    return gulp.src('./client/assets/**/*.{gif,jpg,png,svg}')
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        // png optimization
        optimizationLevel: production ? 3 : 1
      }))
      .pipe(gulp.dest('./client/assets/'));
  },
  // --------------------------
  // Testing with mocha
  // --------------------------
  test: function() {
    return gulp.src('./client/**/*test.js', {read: false})
      .pipe(mocha({
        'ui': 'bdd',
        'reporter': 'spec'
      })
    );
  },


};

gulp.task('serve', ['less'], function() {
    browserSync({
        server: {
            baseDir: "./dist"
        },
        port: process.env.PORT || 3000
    });
});

// gulp.task('reload-sass', ['sass'], function(){
//   browserSync.reload();
// });
gulp.task('reload-less', ['less'], function() {
  browserSync.reload();
});
gulp.task('reload-js', ['browserify'], function(){
  browserSync.reload();
});
gulp.task('reload-templates', ['templates'], function(){
  browserSync.reload();
});

// --------------------------
// CUSTOMS TASKS
// --------------------------
gulp.task('clean', tasks.clean);
// for production we require the clean method on every individual task
var req = build ? ['clean'] : [];
// individual tasks
gulp.task('templates', req, tasks.templates);
gulp.task('assets', req, tasks.assets);
//gulp.task('sass', req, tasks.sass);
gulp.task('less', req, tasks.less);
gulp.task('browserify', req, tasks.browserify);
gulp.task('lint:js', tasks.lintjs);
gulp.task('optimize', tasks.optimize);
gulp.task('test', tasks.test);

// --------------------------
// DEV/WATCH TASK
// --------------------------
gulp.task('watch', ['assets', 'templates', 'less', 'browserify', 'serve'], function() {

  // --------------------------
  // watch:sass
  // --------------------------
  //gulp.watch('./client/scss/**/*.scss', ['reload-sass']);

  // --------------------------
  // watch:css
  // --------------------------
  gulp.watch('./client/**/*.less', ['reload-less']);

  // --------------------------
  // watch:js
  // --------------------------
  gulp.watch('./client/**/*.js', ['lint:js', 'reload-js']);

  // --------------------------
  // watch:html
  // --------------------------
  gulp.watch(['./client/**/*.html', './client/*.html'], ['reload-templates']);

  gutil.log(gutil.colors.bgGreen('Watching for changes...'));
});

// build task
gulp.task('build', [
  'clean',
  'templates',
  'assets',
  'less',
  'browserify'
]);

gulp.task('default', ['watch', 'serve']);

// gulp (watch) : for development and livereload
// gulp build : for a one off development build
// gulp build --production : for a minified production build