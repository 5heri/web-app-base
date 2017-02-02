const shell = require('gulp-shell');

module.exports = function() {
  if (process.env.CIRCLE_BRANCH) {
    process.stdout.write('Using circleCI configuration\n');
    return shell.task(['node_modules/.bin/nightwatch --config node_modules/gopro-web-login-e2e/nightwatch.conf.js --test tests/e2e/main/MainPage_tests.js']);
  }
  process.stdout.write('Using local dev configuration\n');
  return shell.task(['E2E_ENVIRONMENT=development node_modules/.bin/nightwatch --config node_modules/gopro-web-login-e2e/nightwatch.conf.js --test tests/e2e/main/MainPage_tests.js']);
};
