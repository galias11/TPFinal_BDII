// @Vendors
const nmea = require('node-nmea');

// @Constants
const { TYPE_GENERAL, TYPE_POSITION, TYPE_TIRES } = require('../constants/constants');

const parseNMEA = raw => (nmea.parse(raw));

const parseBinary = raw => {
  const mac = parseInt(raw.substring(0, 8), 16);
  const pressure = parseInt(raw.substring(8, 10), 16);
  const temperature = parseInt(raw.substring(10, raw.length), 16);
  return { mac, pressure, temperature};
}

const getParsedData = (data, collection) => {
  switch(collection) {
    case TYPE_GENERAL: 
      return data;
    case TYPE_POSITION:
      return { id: data.id, positionData: parseNMEA(data.position), timestamp: data.timestamp};
    case TYPE_TIRES:
      return { id: data.id, sensorData: parseBinary(data.value), timestamp: data.timestamp};
    default:
      return data;
  }
}

module.exports = {
  getParsedData,
  parseBinary,
  parseNMEA
}