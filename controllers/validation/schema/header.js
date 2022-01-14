const Joi = require("joi");
module.exports = Joi.object().keys({
  authorization: Joi.string().required(),
});
