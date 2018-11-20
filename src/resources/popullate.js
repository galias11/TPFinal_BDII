// @Vendors
const fetch = require('node-fetch');

// @resourcers
const vehicles = require('./vehicles.json');

// @Constants
const { SERVER_MAIN_HOST, SERVER_MAIN_PORT } = require('../constants/constants');

// @Routes
const { REGISTER_DATA, REGISTER_VEHICLE } = require('../constants/routes');

vehicles.forEach(vehicle => {
  fetch(`http://${SERVER_MAIN_HOST}:${SERVER_MAIN_PORT}${REGISTER_VEHICLE}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vehicle)})
    .then(res => res.json()) 
    .then(json => console.log(json))
    .catch(() => console.log('request failed'));
  const { id, lastService, tipo } = vehicle;
  let minLitros;
  let maxLitros;
  let modConsumo;
  let velocidadPromedio;
  let RPMPromedio;
  let torquePromedio;
  switch(tipo) {
    case 'auto':
      minLitros = 6;
      maxLitros= 45;
      modConsumo = 1.5;
      velocidadPromedio= 130;
      RPMPromedio = 3000;
      torquePromedio = 2.0;
      break;
    case 'camioneta':
      minLitros = 10;
      maxLitros= 60;
      modConsumo = 2.5;
      velocidadPromedio= 100;
      RPMPromedio = 4500;
      torquePromedio = 3.5;
      break;
    case 'camion':
      minLitros = 15;
      maxLitros= 100;
      modConsumo = 4.0;
      velocidadPromedio= 90;
      RPMPromedio = 5000;
      torquePromedio = 5.2;
      break;
    case 'tractor':
      minLitros = 7;
      maxLitros= 80;
      modConsumo = 4.0;
      velocidadPromedio= 40;
      RPMPromedio = 6000;
      torquePromedio = 6.5;
      break;
    default:
      minLitros = 6;
      maxLitros= 45;
      modConsumo = 1.5;
      velocidadPromedio= 130;
      RPMPromedio = 3000;
      torquePromedio = 2.0;
      break;
  }
  let timestamp = (new Date()).getTime();
  let litrosTanque = maxLitros;
  let kilometers = lastService;
  let time = lastService;
  const interval = setInterval(() => {
    kilometers = kilometers + 10;
    time = time + 7.5 * Math.random();
    const consumo = Math.random() * modConsumo;
    const velocidad = velocidadPromedio + (Math.random() * 30 * (Math.random() > 0.5 ? 1 : -1));
    const torque = torquePromedio + (Math.random() * 1 * (Math.random() > 0.5 ? 1 : -1));
    const RPM = RPMPromedio + (Math.random() * 2000 * (Math.random() > 0.5 ? 1 : -1));
    let kilometraje = kilometers;
    let horometro = time;
    timestamp = timestamp + (36000 + Math.random() * 18000 * (Math.random() > 0.5 ? 1 : -1));
    litrosTanque = (litrosTanque - consumo) > minLitros ? litrosTanque - consumo : maxLitros;
    const data = {
      id,
      timestamp,
      velocidad,
      torque,
      RPM,
      litrosTanque,
      kilometraje,
      horometro
    }
    fetch(`http://${SERVER_MAIN_HOST}:${SERVER_MAIN_PORT}${REGISTER_DATA}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)})
      .then(res => res.json()) 
      .then(json => console.log(json))
      .catch(() => console.log('request failed'));
    if(kilometers >= lastService + 9700) {
      clearInterval(interval);
    }
  }, 100);
});

