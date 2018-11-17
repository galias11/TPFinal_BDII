/* 
Logging utilities
*/

// @Vendors
const moment = require('moment');
require('moment/locale/es');

const getTime = (received) => {
  const timeStamp = received ? received : (new Date()).getTime();
  return moment(timeStamp).format('DD/MM/YYYY HH:mm:SS');
}

const logIncomingRequest = (requestInfo) => {
  const { received, remoteAddress, remotePort } = requestInfo;
  console.log(`${getTime(received)}: Incoming request from ${remoteAddress}:${remotePort}`);
}

const logError = (errData) => {
  console.log(`${getTime()}: Error detected: ${errData}`);
}

const logInfo = (data) => {
  console.log(`${getTime()}: ${data}`);
}

module.exports = {
  logIncomingRequest,
  logInfo,
  logError
};