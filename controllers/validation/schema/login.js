const Joi = require("joi");
module.exports = Joi.object().keys({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});
