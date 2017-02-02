const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const task = require('./config/gulp/task-helper')(gulp, plugins);

// Tasks
gulp.task('uglify', task.get('uglify'));
gulp.task('sass-build', task.get('sass-build'));
gulp.task('sass-server', task.get('sass-server'));
gulp.task('babel-server', task.get('babel-server'));
gulp.task('build', ['sass-build', 'img-min'], task.get('build'));
gulp.task('eslint', task.get('eslint'));
gulp.task('e2e', task.get('e2e'));
gulp.task('stylelint', task.get('stylelint'));
gulp.task('watch', task.get('watch'));
gulp.task('test', task.get('test'));
gulp.task('test_ci', task.get('test_ci'));
gulp.task('dev-server', task.get('dev-server'));
gulp.task('git-sha', task.get('git-sha'));
gulp.task('server', ['babel-server']);
gulp.task('dev', ['dev-server', 'sass-server', 'img-min', 'eslint', 'stylelint', 'babel-server', 'watch']);
gulp.task('deploy-s3-assets', task.get('deploy-s3-assets'));
gulp.task('patch', task.get('bump.js', 'patch', argv.tag));
gulp.task('minor', task.get('bump.js', 'minor', argv.tag));
gulp.task('major', task.get('bump.js', 'major', argv.tag));

// Default task
gulp.task('default', ['dev']);

// return non-zero exit code on eslint or other gulp failures
process.on('exit', function() {
  if (gulp.fail) {
    process.exit(1);
  }
});
