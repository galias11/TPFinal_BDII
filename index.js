// @Vendors
const Hapi = require('hapi'); //@npm MIT license

// @Handlers
const { 
  handleExample,
  handleGetAverageConsumption,
  hangleGetData,
  handleGetServiceProximity,
  handleGetTimeInMdP,
  handleGetVehiclePosition,
  handleInsertData,
  handleInsertVehicle
} = require('./src/handlers');

// @Model
const DBClient = require('./src/model/dbClient');

// @Routes
const { 
  GET_AVERAGE_CONSUMPTION, 
  GET_DATA, 
  GET_MDP_TIME,
  GET_SERVICE_PROXIMITY,
  GET_VEHICLE_POSITION,
  ROOT, 
  REGISTER_DATA,
  REGISTER_VEHICLE 
} = require('./src/constants/routes');

// @Constants
const { 
  SERVER_MAIN_HOST, 
  SERVER_MAIN_PORT 
} = require('./src/constants/constants');

// @Messages
const {
  DB_SERVER_CONN_ERROR,
  SERVER_STARTED
} = require('./src/constants/messages');

// @Helpers
const { logError, logIncomingRequest, logInfo } = require('./src/helpers/logHelper');

//SetUps and starts server
async function serverInitialize(dbClient) {

  // Server ip and port configurationa
  const server = Hapi.server({
    host: SERVER_MAIN_HOST,
    port: SERVER_MAIN_PORT
  });

  // Server methods register
  server.method('insertData', dbClient.insertData, {});
  server.method('getData', dbClient.getData, {});
  server.method('closeConn', dbClient.close, {});
  server.method('mapReduce', dbClient.mapReduce, {});
  server.method('aggregate', dbClient.aggregate, {});

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
    handler: (request, response) => {return routeRequest(request, response, handleExample)}
  });

  server.route({
    method: 'POST',
    path: REGISTER_DATA,
    options: { log: { collect: true } },
    handler: (request, response) => {return routeRequest(request, response, handleInsertData)}
  });

  server.route({
    method: 'POST',
    path: REGISTER_VEHICLE,
    options: { log: { collect: true } },
    handler: (request, response) => {return routeRequest(request, response, handleInsertVehicle)}
  });

  server.route({
    method: 'GET',
    path: GET_DATA,
    options: { log: { collect: true } },
    handler: (request, response) => {return routeRequest(request, response, hangleGetData)}
  });

  server.route({
    method: 'GET',
    path: GET_AVERAGE_CONSUMPTION,
    options: { log: { collect: true } },
    handler: (request, response) => {return routeRequest(request, response, handleGetAverageConsumption)}
  });

  server.route({
    method: 'GET',
    path: GET_SERVICE_PROXIMITY,
    options: { log: { collect: true } },
    handler: (request, response) => {return routeRequest(request, response, handleGetServiceProximity)}
  });

  server.route({
    method: 'GET',
    path: GET_VEHICLE_POSITION,
    options: { log: { collect: true } },
    handler: (request, response) => {return routeRequest(request, response, handleGetVehiclePosition)}
  });

  server.route({
    method: 'GET',
    path: GET_MDP_TIME,
    options: { log: { collect: true } },
    handler: (request, response) => {return routeRequest(request, response, handleGetTimeInMdP)}
  });

  //After server is set up, we make server start in order to listen the desired port
  try {
    await server.start();
    logInfo(`${SERVER_STARTED}${server.info.port}`);
  } catch(err) {
    logError(err);
    process.exit(1);
  }
}

// Initializes server
const databaseClient = new DBClient();
databaseClient.connect((err) => {
  if(err) {
    logInfo(DB_SERVER_CONN_ERROR);
    logError(err);
    process.exit(1);
  }
  serverInitialize(databaseClient);
});