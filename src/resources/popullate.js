// @Vendors
const fetch = require('node-fetch');

// @resourcers
const vehicles = require('./vehicles.json');
const positions = require('./nmea.json');
const tyres = require('./tyres.json');

// @Constants
const { SERVER_MAIN_HOST, SERVER_MAIN_PORT } = require('../constants/constants');

// @Routes
const { REGISTER_DATA, REGISTER_VEHICLE } = require('../constants/routes');

const initialValues = {
  auto: {
    minLitros: 6,
    maxLitros: 45,
    modConsumo: 1.5,
    velocidadPromedio: 130,
    RPMPromedio: 3000,
    torquePromedio: 2.0
  },
  camioneta: {
    minLitros: 10,
    maxLitros: 60,
    modConsumo: 2.5,
    velocidadPromedio: 100,
    RPMPromedio: 4500,
    torquePromedio: 3.5
  },
  camion: {
    minLitros: 15,
    maxLitros: 100,
    modConsumo: 4.0,
    velocidadPromedio: 90,
    RPMPromedio: 5000,
    torquePromedio: 5.2
  },
  tractor: {
    minLitros: 7,
    maxLitros: 80,
    modConsumo: 4.0,
    velocidadPromedio: 40,
    RPMPromedio: 6000,
    torquePromedio: 6.5
  }
}

const positionQuantity = positions.length;
const tyresSetQuantity = tyres.length;

vehicles.forEach(vehicle => {
  fetch(`http://${SERVER_MAIN_HOST}:${SERVER_MAIN_PORT}${REGISTER_VEHICLE}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vehicle)})
    .then(res => res.json()) 
    .then(json => console.log(json))
    .catch(() => console.log('request failed'));
  const { id, lastService, tipo } = vehicle;
  let { minLitros, maxLitros, modConsumo, velocidadPromedio, RPMPromedio, torquePromedio } = initialValues[tipo];
  let timestamp = (new Date()).getTime();
  let litrosTanque = maxLitros;
  let kilometers = lastService;
  let time = lastService;
  let positionIndex = Math.floor((positionQuantity - 1) * Math.random());
  let tyresIndex = Math.floor((tyresSetQuantity - 1) * Math.random());
  let tyresCounter = 5;
  const interval = setInterval(() => {
    kilometers = kilometers + 10;
    time = time + 7.5 * Math.random();
    const consumo = Math.random() * modConsumo;
    const velocidad = velocidadPromedio + (Math.random() * 30 * (Math.random() > 0.5 ? 1 : -1));
    const torque = torquePromedio + (Math.random() * 1 * (Math.random() > 0.5 ? 1 : -1));
    const RPM = RPMPromedio + (Math.random() * 2000 * (Math.random() > 0.5 ? 1 : -1));
    const position = positions[positionIndex];
    const tyresData = tyres[tyresIndex];
    let kilometraje = kilometers;
    let horometro = time;
    timestamp = timestamp + (36000 + Math.random() * 18000 * (Math.random() > 0.5 ? 1 : -1));
    litrosTanque = (litrosTanque - consumo) > minLitros ? litrosTanque - consumo : maxLitros;
    positionIndex = positionIndex === positionQuantity - 1 ? 0 : positionIndex + 1;
    if(!tyresCounter) {
      tyresCounter = 5;
      tyresIndex = Math.floor((tyresSetQuantity - 1) * Math.random());
    } else {
      tyresCounter -= 1;
    }
    const sensorData = {
      id,
      timestamp,
      velocidad,
      torque,
      RPM,
      litrosTanque,
      kilometraje,
      horometro
    };
    const positionData = {
      id,
      timestamp,
      position
    };
    const tyre1Data = {
      id,
      timestamp,
      value: tyresData[0]
    };
    const tyre2Data = {
      id,
      timestamp,
      value: tyresData[1]
    };
    const tyre3Data = {
      id,
      timestamp,
      value: tyresData[2]
    };
    const tyre4Data = {
      id,
      timestamp,
      value: tyresData[3]
    };
    fetch(`http://${SERVER_MAIN_HOST}:${SERVER_MAIN_PORT}${REGISTER_DATA}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sensorData)})
      .then(res => res.json()) 
      .then(json => console.log(json))
      .catch(() => console.log('request failed'));
    fetch(`http://${SERVER_MAIN_HOST}:${SERVER_MAIN_PORT}${REGISTER_DATA}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(positionData)})
      .then(res => res.json()) 
      .then(json => console.log(json))
      .catch(() => console.log('request failed'));
    fetch(`http://${SERVER_MAIN_HOST}:${SERVER_MAIN_PORT}${REGISTER_DATA}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tyre1Data)})
      .then(res => res.json()) 
      .then(json => console.log(json))
      .catch(() => console.log('request failed'));
    fetch(`http://${SERVER_MAIN_HOST}:${SERVER_MAIN_PORT}${REGISTER_DATA}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tyre2Data)})
      .then(res => res.json()) 
      .then(json => console.log(json))
      .catch(() => console.log('request failed'));
    fetch(`http://${SERVER_MAIN_HOST}:${SERVER_MAIN_PORT}${REGISTER_DATA}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tyre3Data)})
      .then(res => res.json()) 
      .then(json => console.log(json))
      .catch(() => console.log('request failed'));
    fetch(`http://${SERVER_MAIN_HOST}:${SERVER_MAIN_PORT}${REGISTER_DATA}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tyre4Data)})
      .then(res => res.json()) 
      .then(json => console.log(json))
      .catch(() => console.log('request failed'));
    if(kilometers >= lastService + 9700) {
      clearInterval(interval);
    }
  }, 1000);
});

