import AppConfig from '../AppConfig';

module.exports = function(gulp) {
  return function() {
    gulp.src('src/img/*')
      .pipe(gulp.dest(`${AppConfig.localAssetPath}`));
  };
};
