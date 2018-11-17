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

const getDataType = (data, options) => {
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

module.exports = {
  getDataType
};