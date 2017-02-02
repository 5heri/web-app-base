const shell = require('gulp-shell');

module.exports = function() {  
  return shell.task(['node ./node_modules/webpack/bin/webpack.js --config webpack.config.js --progress --colors --display-error-details --display-reasons']);
};
