const Server = require('karma').Server;

module.exports = function() {
  return function(done) {
    process.env.instrumentcoverage = 'false';
    new Server({
      configFile: __dirname + '/../../karma.conf.js'
    }, done).start();
  };
};
