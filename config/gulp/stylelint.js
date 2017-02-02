module.exports = function(gulp, plugins) {
  return function() {
    return gulp.src(['src/scss/**/*.scss'])

      .pipe(plugins.stylelint({
        failAfterError: true,
        reporters: [
          {
            formatter: 'string',
            console: true
          }
        ]
      }));
  };
};
