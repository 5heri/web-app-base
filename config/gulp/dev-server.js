const shell = require('gulp-shell');

module.exports = function() {
  return shell.task(['node ./node_modules/webpack/bin/webpack.js --verbose --colors --display-error-details --config webpack.client-watch.babel.js && node ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --port 8083 --config webpack.client-watch.babel.js']);
};
