const spawn = require('child_process').spawn;

// Start the server
module.exports = function() {
  return function() {
    const env = Object.create( process.env );
    env.NODE_PATH = './src';
    const serverCommand = '--max-old-space-size=6144 ./babel.server';
    const serverSpawn = spawn('node', [serverCommand], {
      shell: true,
      env: env
    });

    // Return data to standard out
    serverSpawn.stdout.on('data', function(data) {
      process.stdout.write(data.toString());
    });

    // Return errors to standard out
    serverSpawn.on('error', function(error) {
      process.stdout.write(error);
    });

    // when the spawn child process exits, check if there were any errors
    // and close the writeable stream
    serverSpawn.on('exit', function(code) {
      if (code !== 0) {
        process.stdout.write('Failed: ' + code);
      }
    });
  };
};
