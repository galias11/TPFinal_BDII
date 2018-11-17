// @Constants
const { BAD_REQUEST } = require('../constants/messages');

// @Helpers
const { getDataType } = require('../helpers/schemaValitaionHelper');

// Root generic handler
const handleExample = (request, h) => {
  const response = h.response({status: 200, response: 'Car fleet server is listening...'});
  return response;
}

// Save data simple handler
async function handleInsertData(request, h) {
  const { payload } = request;
  if(!payload) {
    return h.response({response: { errCode: '400', err: BAD_REQUEST }})
  }
  const collection = getDataType(payload);
  const response = await request.server.methods.insertData('bd2_tpfinal', collection, payload)
    .then(() => (h.response({response: { success: true, description: 'Data succesfully saved' }})))
    .catch(err => (h.response({response: { errCode: '001', err: err }})))
  return response;
}

// Save data simple handler
async function hangleGetData(request, h) {
  const { query } = request;
  const { collection } = query;
  if(!collection) {
    return h.response({response: { errCode: '400', err: BAD_REQUEST }})
  }
  const response = await request.server.methods.getData('bd2_tpfinal', collection, undefined)
    .then(results => (h.response({response: { success: true, data: results }})))
    .catch(err => (h.response({response: { errCode: '001', err: err }})))
  return response;
}


module.exports = {
  handleExample,
  hangleGetData,
  handleInsertData
};