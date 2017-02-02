module.exports = function(gulp, plugins) {
  return function() {
    gulp.task('watch', function() {
      plugins.livereload.listen(35723);
      gulp.watch('src/scss/**/*.scss', ['sass-server']);
    });
  };
};
