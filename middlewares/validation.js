const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),

    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string.empty": 'Weather is a required type that must be filled in',
      "any.only": 'Weather field must be of type hot, warm or cold'
    })
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({

    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    avatar: Joi.string().allow('').allow(null).custom(validateURL).messages({
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),

    email: Joi.string().required().email().messages({
      "string.empty": 'Email is a required field that must be filled in',
      "string.email": 'Email field must be of type email'
    }),
    password: Joi.string().required().messages({
      "string.empty":'You must fill in a password'
    })
  })
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'Email is a required field that must be filled in',
      "string.email": 'Email field must be of type email'
    }),
    password: Joi.string().required().messages({
      "string.empty":'You must fill in a password'
    })
  })
})

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required().messages({
      "any.required":'ID is a required field and cannot be empty',
      "string.hex":'ID must be of hex value type',
      "string.length": 'ID must be at least 24 characters long'
    })
  })
})

module.exports.validateUserUpdateEvent = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    avatar: Joi.string().allow('').allow(null).custom(validateURL).messages({
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  })
})