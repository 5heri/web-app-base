const shell = require('gulp-shell');

module.exports = function() {
  return shell.task(['node ./node_modules/webpack/bin/webpack.js --verbose --colors --display-error-details --config webpack.dev.js && node ./docs/src/dev-server.js']);
};
