var Server = require('hapi').Server;
const hostname = '0.0.0.0';

/**
 * Start Hapi server.
 */
const server = new Server();
server.connection({host: hostname, port: 1234});

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route([{
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('docs/index.html');
        }
    },
    {
      // catchall for react routes
      method: 'GET',
      path: `/{params*}`,
      config: {
        handler: (request, reply) => {
          reply.file('docs/' + request.path);
        }
      }
    }

  ]);

    server.start((err) => {

        if (err) {
            throw err;
        }

        console.log('Server running at:', server.info.uri);
    });
});
