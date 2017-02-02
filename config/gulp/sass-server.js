import AppConfig from '../AppConfig';

module.exports = function(gulp, plugins) {
  return function() {
    gulp.src(['src/scss/styles.scss'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer())
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest(AppConfig.localAssetPath))
    .pipe(plugins.sourcemaps.write('./maps'))
    .pipe(plugins.livereload());
  };
};