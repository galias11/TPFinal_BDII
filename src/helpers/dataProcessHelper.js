// @Vendors
const groupBy = require('lodash/groupBy');
const orderBy = require('lodash/orderBy');

const getMdpTime = (innerPoistions, outerPositions) => {
  const mdpPositions = innerPoistions.map(position => ({id: position.id, timestamp: position.timestamp, inner: true}));
  const noMdpPosition = outerPositions.map(position => ({ id: position.id, timestamp: position.timestamp, inner: false}));
  const sortedPositions = orderBy(mdpPositions.concat(noMdpPosition), 'timestamp', 'asc');
  const groupedPositions = groupBy(sortedPositions, position => position.id);
  return Object.keys(groupedPositions).map(vehicle => {
    let acumulatedTime = 0.0;
    let isLastInner = false;
    let enterTime = 0.0;
    groupedPositions[vehicle].forEach(position => {
      if(position.inner && !isLastInner) {
        isLastInner = true;
        enterTime = position.timestamp;
      }
      if(!position.inner && isLastInner) {
        isLastInner = false;
        acumulatedTime += position.timestamp - enterTime;
      }
    });
    return { id: vehicle, acumulatedMdpTime: acumulatedTime };
  });
}

const calculateDistanceAndConsumption = trackData => {
  let lastKilometraje = 0.0;
  let lastLitrosTanque = 0.0;
  let first = true;
  const processedData = orderBy(trackData, 'timestamp', 'asc')
  processedData.forEach(data => {
    if(first) {
      first = false;
    } else {
      data.diffKilometraje = data.kilometraje - lastKilometraje;
      data.diffLitrosTanque = data.litrosTanque < lastLitrosTanque ?  lastLitrosTanque - data.litrosTanque : 0.0;
    }
    lastKilometraje = data.kilometraje;
    lastLitrosTanque = data.litrosTanque;
  });
  return processedData;
}

const proccessTrackData = (jointData, minTirePressure) => {
  let acumKilometraje = 0.0;
  let acunLitrosTanque = 0.0;
  let periodStarted = {};
  jointData.forEach(data => {
    if(data.mac && data.pressure < minTirePressure) {
      if(!periodStarted[data.mac]) {
        periodStarted[data.mac] = true;
      }
    }
    if(data.mac && data.pressure >= minTirePressure) {
      if(periodStarted[data.mac]) {
        periodStarted[data.mac] = false
      }
    }
    if(data.diffKilometraje && Object.keys(periodStarted).filter(key => periodStarted[key]).length){
      acumKilometraje += data.diffKilometraje;
      acunLitrosTanque += data.diffLitrosTanque;
    }
  });
  return {
    acumKilometraje,
    acunLitrosTanque
  }
}

const getAverageConsumptionUnderCondition = (vehicleData, minTirePressure) => {
  return vehicleData.map(vehicle => {
    const distancesAndConsumption = calculateDistanceAndConsumption(vehicle.generalData);
    const jointData = orderBy(vehicle.tiresData.concat(distancesAndConsumption), 'timestamp', 'asc');
    const { acumKilometraje, acunLitrosTanque } = proccessTrackData(jointData, minTirePressure);
    return {
      vehicleId: vehicle._id,
      acumKilometraje,
      acunLitrosTanque,
      consumoPromedio: acumKilometraje ? acunLitrosTanque / acumKilometraje : 0.0
    }
  });
}

module.exports = {
  getAverageConsumptionUnderCondition,
  getMdpTime
}