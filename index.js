// @Vendors
const Hapi = require('hapi'); //@npm MIT license

// @Handlers
const { testHandler } = require('./src/handlers');

// @Constants
const { ROOT } = require('./src/constants/routes');
const { SERVER_MAIN_HOST, SERVER_MAIN_PORT } = require('./src/constants/constants');

// @Helpers
const { logIncomingRequest } = require('./src/helpers/logHelper');

//SetUps and starts server
async function serverInitialize() {

  // Server ip and port configurationa
  const server = Hapi.server({
    host: SERVER_MAIN_HOST,
    port: SERVER_MAIN_PORT
  });

  // Handles connection abort
  server.events.on({ name: 'request' }, (request, event, tags) => {
    if(tags.abort) {
      //Handle abort
    }
  });

  // Request logging
  server.events.on('log', (events) => {
    logIncomingRequest(events.tags[0].info);
  });

  // Pre-processes a incoming request
  const routeRequest = (request, response, handler) => {
    server.log(request);
    return handler(request, response);
  }

  server.route({
    method: 'GET',
    path: ROOT,
    options: { log: { collect: true } },
    handler: (request, response) => {return routeRequest(request, response, testHandler)}
  });

  //After server is set up, we make server start in order to listen the desired port
  try {
    await server.start();
    console.log(`Server is now running at port ${server.info.port}`);
  } catch(err) {
    console.log(err);
    process.exit(1);
  }
}

// Initializes server
serverInitialize();