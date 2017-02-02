import AppConfig from '../AppConfig';

module.exports = function(gulp, plugins) {
  return function() {
    gulp.src('lib/*.js')
      .pipe(plugins.uglify())
      .pipe(gulp.dest(AppConfig.localAssetPath));
  };
};
