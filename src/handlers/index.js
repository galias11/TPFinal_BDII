// Root generic handler
const handleExample = (request, h) => {
  const response = h.response({status: 200, response: 'Car float server is listening...'});
  return response;
}

// Save data simple handler
async function handleInsertData(request, h) {
  const { payload } = request;
  const response = await request.server.methods.insertData('bd2_tpfinal', 'test', payload)
    .then(() => (h.response({response: { success: true, description: 'Data succesfully saved' }})))
    .catch(err => (h.response({response: { errCode: '001', err: err }})))
  return response;
}

// Save data simple handler
async function hangleGetData(request, h) {
  const { query } = request;
  const response = await request.server.methods.getData('bd2_tpfinal', 'test', query)
    .then(results => (h.response({response: { success: true, data: results }})))
    .catch(err => (h.response({response: { errCode: '001', err: err }})))
  return response;
}


module.exports = {
  handleExample,
  hangleGetData,
  handleInsertData
};