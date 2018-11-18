/*
Average consumption map reduce
*/

// Map reduce utility for average consumption
function consumptionMapData() {
  /* eslint-disable  no-undef */
  emit({id: this.id, tipo: this.tipo || 'not_defined'}, { litrosTanque: this.litrosTanque, kilometraje: this.kilometraje, single: true });
  /* eslint-enable  no-undef */
}

function consumptionMapReduce(key, values) {
  const results = { litresConsumed: 0.0, kilometers: 0.0, single: false };
  const last = { litrosTanque: 0, kilometraje: 0 };
  values.forEach(value => {
    if(value.litrosTanque < last.litrosTanque) {
      results.litresConsumed += last.litrosTanque - value.litrosTanque; 
    }
    if(last.kilometraje && value.kilometraje > last.kilometraje) {
      results.kilometers += value.kilometraje - last.kilometraje;
    }
    last.litrosTanque = value.litrosTanque;
    last.kilometraje = value.kilometraje;
  });
  return results;
}

function consumptionFinalize(key, reducedVal) {
  if(reducedVal.single) {
    return { litresConsumed: 0.0, kilometers: 0.0 };
  }
  const { litresConsumed, kilometers } = reducedVal;
  return { litresConsumed, kilometers };
}

const consumptionAggregate = [
  { '$group': {
    '_id': '$_id.tipo',
    'litresConsumed': { '$sum': '$value.litresConsumed' },
    'kilometers': { '$sum': '$value.kilometers' }
  }},
  { '$project': {
    'vehicleType': '$_id',
    'litresConsumed': '$litresConsumed',
    'kilometers': '$kilometers',
    'averageConsumption': {'$cond': [ { '$eq': ['$kilometers', 0] }, 0.0, { '$divide': [ '$litresConsumed', '$kilometers' ] }]}
  }}
];

const consumptionOptions = {
  out: 'results_by_vehicle',
  finalize: consumptionFinalize
}

module.exports = {
  consumption: { mapData: consumptionMapData, mapReduce: consumptionMapReduce, options: consumptionOptions, aggregationQuery: consumptionAggregate }
}