// @Vendors
const Joi = require('joi');

// @Constants
const {
  TYPE_GENERAL,
  TYPE_POSITION,
  TYPE_TIRES,
  TYPE_UNKNOWN
} = require('../constants/constants');

const positionSchema = Joi.object().keys({
  id: Joi.string().required(),
  position: Joi.string().required()
});

const tyresSchema = Joi.object().keys({
  id: Joi.string().required(),
  value: Joi.alternatives([Joi.string(), Joi.number()]).required(),
});

const generalSchema = Joi.object().keys({
  id: Joi.string().required(),
  timeStamp: Joi.number().required(),
  velocidad: Joi.alternatives([Joi.string(), Joi.number()]).required(),
  torque: Joi.alternatives([Joi.string(), Joi.number()]).required(),
  RPM: Joi.alternatives([Joi.string(), Joi.number()]).required(),
  litrosTanque: Joi.alternatives([Joi.string(), Joi.number()]).required(),
  kilometraje: Joi.alternatives([Joi.string(), Joi.number()]).required(),
  horometro: Joi.alternatives([Joi.string(), Joi.number()]).required(),
});

const vehicleSchema = Joi.object().keys({
  id: Joi.string().required(),
  tipo: Joi.string().required(),
  modelo: Joi.number().required(),
  descripcion: Joi.string().required(),
  lastService: Joi.number().required()
})

const getDataType = (data, options = {allowUnknown: true}) => {
  if(!data) {
    return;
  }
  if(Joi.validate(data, positionSchema, options).error === null) {
    return TYPE_POSITION;
  }
  if(Joi.validate(data, tyresSchema, options).error === null) {
    return TYPE_TIRES;
  }
  if(Joi.validate(data, generalSchema, options).error === null) {
    return TYPE_GENERAL;
  }
  return TYPE_UNKNOWN;
}

const validateVehicleSchema = (data, options = {}) => (Joi.validate(data, vehicleSchema, options).error === null);

module.exports = {
  getDataType,
  validateVehicleSchema
};