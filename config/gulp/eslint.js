module.exports = function(gulp, plugins) {
  return function() {
    return gulp.src(['src/**/*.js', '*.js', 'config/**/*.js'])

      // eslint() attaches the lint output to the eslint property
      // of the file object so it can be used by other modules.
      .pipe(plugins.eslint())

      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(plugins.eslint.format())

      // fail on eslint errors and warnings only on circle CI builds
      .on('data', function(file) {
        const isCircle = process.env.CIRCLE_BRANCH;
        if (isCircle && file.eslint.messages && file.eslint.messages.length) {
          gulp.fail = true;
        }
      });
  };
};
