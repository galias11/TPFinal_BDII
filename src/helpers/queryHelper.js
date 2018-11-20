/*
Average consumption map reduce
*/

// @Constants
const { VEHICLE_SERVICE_INTERVAL, WARNING_MIN } = require('../constants/constants');

/************************************************************************
 * 2- Vehicles average consumption
 ************************************************************************/

// Map reduce utility for average consumption
function consumptionMapData() {
  /* eslint-disable  no-undef */
  emit(this.id, { 
    litresConsumed: this.litresConsumed, 
    kilometersTravelled: this.kilometersTravellled,
    litrosTanque: this.litrosTanque, 
    kilometraje: this.kilometraje,
    processed: this.processed 
  });
  /* eslint-enable  no-undef */
}

function consumptionMapReduce(key, values) {
  const results = { 
    litresConsumed: values[0].processed ? values[0].litresConsumed : 0.0, 
    kilometersTravelled: values[0].processed ? values[0].kilometersTravelled : 0.0, 
    litrosTanque: 0.0,
    kilometraje: 0.0,
    processed: true 
  };
  let last = { litrosTanque: 0.0, kilometraje: 0.0 };
  values.forEach(value => {
    if(value.litrosTanque < last.litrosTanque) {
      results.litresConsumed += last.litrosTanque - value.litrosTanque; 
    }
    if(last.kilometraje && value.kilometraje > last.kilometraje) {
      results.kilometersTravelled += value.kilometraje - last.kilometraje; 
    }
    last = { litrosTanque: value.litrosTanque, kilometraje: value.kilometraje };
  });
  results.litrosTanque = last.litrosTanque;
  results.kilometraje = last.kilometraje;
  return results;
}

function consumptionFinalize(key, reducedVal) {
  if(!reducedVal.processed) {
    return { litresConsumed: 0.0, kilometersTravelled: 0.0 };
  }
  const { litresConsumed, kilometersTravelled } = reducedVal;
  return { litresConsumed, kilometersTravelled };
}

const consumptionAggregatePipeline = [
  { $lookup: {
    from: 'vehicles',
    localField: '_id',
    foreignField: 'id',
    as: 'vehicleData'
  }},
  { $addFields: {
    vehicle: { $arrayElemAt: [ '$vehicleData', 0 ] }
  }},
  { $group: {
    _id: '$vehicle.tipo',
    litresConsumed: { $sum: '$value.litresConsumed' },
    kilometersTravelled: { $sum: '$value.kilometersTravelled' }
  }},
  { $project: {
    vehicleType: '$_id.tipo',
    litresConsumed: '$litresConsumed',
    kilometersTravelled: '$kilometersTravelled',
    averageConsumption: {$cond: [ { $eq: ['$kilometersTravelled', 0] }, 0.0, { $divide: [ '$litresConsumed', '$kilometersTravelled' ] }]}
  }}
];

const consumptionOptions = {
  limit: 999999,
  out: {merge: 'results_by_vehicle'},
  finalize: consumptionFinalize
}

const consumptionQuery = { 
  mapData: consumptionMapData, 
  mapReduce: consumptionMapReduce, 
  options: consumptionOptions, 
  aggregationPipeline: consumptionAggregatePipeline 
};

/************************************************************************
 * 5- Vehicles service check
 ************************************************************************/

const serviceCheckAggregationQuery = [
  { $sort: { timestamp: 1 }},
  { $group: {
    _id: '$id',
    kilometraje: { $last: '$kilometraje' },
    horometro: { $last: '$horometro' },
    timestamp: { $last: '$timestamp' }
  }},
  { $lookup: {
    from: 'vehicles',
    localField: '_id',
    foreignField: 'id',
    as: 'vehicleData'
  }},
  { $addFields: {
    vehicle: { $arrayElemAt: [ '$vehicleData', 0 ] },
  }},
  { $addFields: {
    toService: { $subtract: [
      VEHICLE_SERVICE_INTERVAL,
      { $subtract: [
        {$cond: [ {$or: [{ $eq: ['$vehicle.tipo', 'camion'] }, { $eq: ['$vehicle.tipo', 'tractor'] }]}, '$horometro', '$kilometraje' ]},
        '$vehicle.lastService' ]}]}
  }},
  { $project: {
    id: '$_id',
    kilometraje: '$kilometraje',
    horometro: '$horometro',
    lastService: '$vehicle.lastService',
    toService: '$toService'
  }},
  { $match: {
    toService: { $lt: WARNING_MIN }
  }}
]

module.exports = {
  consumption: consumptionQuery,
  serviceCheckAggregationQuery
}