// @Constants
const { BAD_REQUEST } = require('../constants/messages');
const { DB_NAME, TYPE_GENERAL, VEHICLES } = require('../constants/constants');

// @Helpers
const { getDataType, validateVehicleSchema } = require('../helpers/schemaValitaionHelper');
const { consumption, serviceCheckAggregationQuery } = require('../helpers/queryHelper');

// Root generic handler
const handleExample = (request, h) => {
  const response = h.response({status: 200, response: 'Car fleet server is listening...'});
  return response;
}

// Insert vehicle
async function handleInsertVehicle(request, h) {
  const { payload } = request;
  if(!payload || !validateVehicleSchema(payload)) {
    return h.response({response: { errCode: '400', err: BAD_REQUEST }})
  }
  const response = await request.server.methods.insertData(DB_NAME, VEHICLES, payload)
    .then(() => (h.response({response: { success: true, description: 'Data succesfully saved' }})))
    .catch(err => (h.response({response: { errCode: '001', err: err }})))
  return response;
}

// Save data simple handler
async function handleInsertData(request, h) {
  const { payload } = request;
  if(!payload) {
    return h.response({response: { errCode: '400', err: BAD_REQUEST }})
  }
  const collection = getDataType(payload);
  const response = await request.server.methods.insertData(DB_NAME, collection, payload)
    .then(() => (h.response({response: { success: true, description: 'Data succesfully saved' }})))
    .catch(err => (h.response({response: { errCode: '001', err: err }})))
  return response;
}

// Get data simple handler
async function hangleGetData(request, h) {
  const { query } = request;
  const { collection } = query;
  if(!collection) {
    return h.response({response: { errCode: '400', err: BAD_REQUEST }})
  }
  const response = await request.server.methods.getData(DB_NAME, collection, undefined)
    .then(results => (h.response({response: { success: true, data: results }})))
    .catch(err => (h.response({response: { errCode: '001', err: err }})))
  return response;
}

// 2- Get average gas consumption
async function handleGetAverageConsumption(request, h) {
  const response = await request.server.methods.mapReduce(DB_NAME, TYPE_GENERAL, consumption)
    .then(results => {
      const totals = {litresConsumed: 0, kilometersTravelled: 0};
      results.forEach(result => {
        totals.litresConsumed += result.litresConsumed;
        totals.kilometersTravelled += result.kilometersTravelled;
      });
      const dataResume = {
        averagePerType: results,
        summary: { ...totals, average: totals.kilometersTravelled === 0 ? 0 : totals.litresConsumed / totals.kilometersTravelled }
      };
      return h.response({response: { success: true, data: dataResume }})
    })
    .catch(err => (h.response({response: { errCode: '001', err: err }})));
  return response;
}

// 5- Gets vehicles that are near to the service stop ( 500 hs / km ahead)
async function handleGetServiceProximity(request, h) {
  const response = await request.server.methods.aggregate(DB_NAME, TYPE_GENERAL, serviceCheckAggregationQuery)
    .then(results => (h.response({response: { success: true, data: results }})))
    .catch(err => (h.response({response: { errCode: '001', err: err }})));
  return response;
}

module.exports = {
  handleExample,
  handleGetAverageConsumption,
  hangleGetData,
  handleGetServiceProximity,
  handleInsertData,
  handleInsertVehicle
};