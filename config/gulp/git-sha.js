const shell = require('gulp-shell');

module.exports = function(gulp) {
  return function() {
    gulp.src('').pipe(shell([
      'sh ./bin/detect_git-sha.sh'
    ]));
  };
};
