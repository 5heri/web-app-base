const Server = require('karma').Server;

/**
 * Run test once using PhantomJS and reporting coverage
 * for use on circleCI
 */
module.exports = function() {
  return function(done) {
    process.env.instrumentcoverage = 'true';
    new Server({
      configFile: __dirname + '/../../karma.conf.js',
      singleRun: true,
      browsers: ['PhantomJS'],
      reporters: 'spec,coverage'
    }, done).start();
  };
};
