var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var del = require('del');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var assign = require('lodash').assign;
var gutil = require('gulp-util');
var globby = require('globby');
var browserSync = require('browser-sync');
var reload = browserSync.reload;




var paths = {
  scripts: ['client/js/*.js'],
  images: 'client/img/*'
};

var browserifyOptions = {
  entries: ['client/js/main.js'],
  debug: true
};


gulp.task('scripts', function () {
  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby(['client/js/*.js'], function(err, entries) {
    // ensure any errors from globby are handled
    if (err) {
      bundledStream.emit('error', err);
      return;
    }

    // create the Browserify instance.
    var b = browserify({
      entries: entries,
      debug: true,
      transform: [reactify]
    });

    // return the Browserify stream so gulp knows this task is done
    return b.bundle();
  });

});

var opts = assign({}, watchify.args, browserifyOptions);
var b = watchify(browserify(opts)); 

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('scripts', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'));
}



 
// Copy all static images 
gulp.task('images', function() {
  return gulp.src(paths.images)
    // Pass in options to the task 
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('dist/img'));
});





// watch files for changes and reload
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], {cwd: 'app'}, reload);
});





gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: 'client'
        }
    });
});

// npm install --save-dev browser-sync



 
// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['scripts', 'images']);