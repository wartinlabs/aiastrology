// validationMiddleware.js
const { celebrate, Joi } = require("celebrate");

const IdValidation = celebrate({
  params: {
    id: Joi.string().hex().length(24).required(),
  },
});

const userLoginValidation = celebrate({
  body: Joi.object({
    phone_no: Joi.string().required().label("Phone No"),
  })
    .messages({
      "string.base": "{{#label}} must be a valid string",
      "string.empty": "{{#label}} cannot be empty",
      "any.required": "{{#label}} is required",
    })
    .options({ abortEarly: false })
    .unknown(true),
});

const chatGptValidation = celebrate({
  body: Joi.object({
    message: Joi.string().required().label("message"),
    chat: Joi.number().valid(0, 1).required().label("chat"),
    historyId: Joi.string().when("chat", {
      is: Joi.number().valid(0),
      then: Joi.string().required(),
      otherwise: Joi.string().allow(""),
    }),
  })
    .messages({
      "string.base": "{{#label}} must be a valid string",
      "string.empty": "{{#label}} cannot be empty",
      "any.required": "{{#label}} is required",
    })
    .options({ abortEarly: false })
    .unknown(true),
});

module.exports = {
  IdValidation,
  userLoginValidation,
  chatGptValidation,
};
