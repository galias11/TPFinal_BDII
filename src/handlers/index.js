// Example handler
const testHandler = (request, response) => {
  const testReplyJSON = { response: { test: 'success'} };
  return JSON.stringify(testReplyJSON);
}

module.exports = {
  testHandler
};