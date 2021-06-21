const { src, dest, watch, series } = require('gulp');

const pug = require('gulp-pug');
const sass = require('gulp-sass');
const babel = require('gulp-babel');

const browserSync = require('browser-sync').create();

function handleError(error) {
  console.log(error.toString());
  this.emit('end');
}

// Compile pug files into HTML
function pugHtml() {
  return src('src/pug/pages/*.pug')
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest('dist'));
}

function html() {
  return src('src/**/*.html').pipe(dest('dist'));
}

// scripts
function scripts() {
  return src('src/js/**/*.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      }).on('error', handleError)
    )
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// Compile sass files into CSS
function styles() {
  return src('src/styles/main.scss')
    .pipe(
      sass({
        includePaths: ['src/sass'],
        errLogToConsole: true,
        outputStyle: 'expanded',
        onError: browserSync.notify,
      })
    )
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

// Copy assets
function assets() {
  return src('src/assets/**/*').pipe(dest('dist/assets/'));
}

// Serve and watch sass/pug files for changes
function watchAndServe() {
  browserSync.init({
    server: 'dist',
  });

  watch('src/styles/**/*.scss', styles);
  watch('src/pug/pages/*.pug', pugHtml);
  // watch('src/**/*.html', html);
  watch('src/assets/**/*', assets);
  watch('src/js/**/*.js', scripts);
  watch('dist/*.html').on('change', browserSync.reload);
}

exports.html = html;
exports.pugHtml = pugHtml;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watchAndServe;
exports.default = series(pugHtml, scripts, styles, assets, watchAndServe);
