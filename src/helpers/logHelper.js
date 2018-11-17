/* 
Logging utilities
*/

// @Vendors
const moment = require('moment');
require('moment/locale/es');

const logIncomingRequest = (requestInfo) => {
  const { received, remoteAddress, remotePort } = requestInfo;
  const time = moment(received).format('DD/MM/YYYY HH:mm:SS');
  console.log(`${time}: Incoming request from ${remoteAddress}:${remotePort}`);
}

module.exports = {
  logIncomingRequest
};