// @Vendors
const nmea = require('node-nmea');

const coord = [
  '$GPGGA,225017.491,3759.859,S,05732.891,W,1,12,1.0,0.0,M,0.0,M,,*61',
  '$GPGGA,220540.409,3750.214,S,05745.308,W,1,12,1.0,0.0,M,0.0,M,,*63',
  '$GPGGA,220541.409,3750.084,S,05723.719,W,1,12,1.0,0.0,M,0.0,M,,*6D',
  '$GPGGA,220542.409,3809.434,S,05723.719,W,1,12,1.0,0.0,M,0.0,M,,*62',
  '$GPGGA,220543.409,3809.564,S,05745.143,W,1,12,1.0,0.0,M,0.0,M,,*6E'
]
console.log(nmea.parse(coord[0]).loc.geojson);
console.log(nmea.parse(coord[1]).loc.geojson);
console.log(nmea.parse(coord[2]).loc.geojson);
console.log(nmea.parse(coord[3]).loc.geojson);