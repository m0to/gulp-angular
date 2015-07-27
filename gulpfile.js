// Include gulp
var gulp = require('gulp');

// Include Plugins
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ngmin = require('gulp-ngmin');
var clean = require('gulp-clean');
var webserver = require('gulp-webserver');

var bases = {
  app: 'app/',
  dist: 'dist/',
  tmp: '.tmp/',
  bower: 'bower_components/'
}

var paths = {
  scripts: ['**/*.coffee'],
  styles: ['**/*.scss'],
  html: ['**/*.html'],
  images: ['assets/**/*.*'],
};

// Delete dist folder
gulp.task('clean', function() {
  gulp.src(bases.dist + '**/*')
    .pipe(clean())
    .pipe(gulp.dest(bases.dist));
});

// Move views
gulp.task('views', function() {
  gulp.src('app/index.html')
    .pipe(gulp.dest('dist/'));
  gulp.src(bases.app + paths.html)
    .pipe(gulp.dest(bases.dist));
});

// Lint Task
gulp.task('lint', function() {
  gulp.src(bases.tmp + 'scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
  gulp.src(bases.app + paths.styles)
    .pipe(sass())
    .pipe(gulp.dest(bases.tmp + 'styles/'));
});

// Concatenate & Minify JS
gulp.task('bower', function() {
  gulp.src(bases.bower + '**/*.js')
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(bases.tmp + 'scripts/'))
    .pipe(rename('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(bases.dist + 'scripts/'));
});


gulp.task('scripts', function() {
  gulp.src(bases.app + paths.scripts)  // read files
    .pipe(
      coffee({bare:true})
        .on('error', gutil.log)
    )
    .pipe(ngmin())
    .pipe(concat('all.js'))
    .pipe(gulp.dest(bases.tmp + 'scripts/'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(bases.dist + 'scripts/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch(['app/index.html'], ['views']);
  gulp.watch(bases.app + paths.scripts, ['lint', 'scripts']);
  gulp.watch(bases.app + paths.styles, ['sass']);
});

gulp.task('webserver', function() {
  gulp.src(bases.dist)
    .pipe(webserver({
      livereload: true,
      directoryList: true,
      open: true
    }));
});

// Default Task
gulp.task('default', ['clean', 'views', 'lint', 'sass', 'scripts', 'bower', 'watch', 'webserver']);
