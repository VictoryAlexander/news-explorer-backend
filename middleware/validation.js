const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

function validateURL(value, helpers) {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

const validateNewUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
  })
})

const validateExistingUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
})

const validateNewArticle = celebrate({
  body: Joi.object().keys({
    source: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    link: Joi.string().required().custom(validateURL).messages({
      'string.uri': 'the "link" field must be a valid url',
    }),
    image: Joi.string().required().custom(validateURL).messages({
      'string.uri': 'the "image" field must be a valid url',
    }),
    date: Joi.string().required(),
    keyword: Joi.string().required()
  })
})

const validateArticleId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24)
  })
})

module.exports = {
  validateNewUser,
  validateExistingUser,
  validateNewArticle,
  validateArticleId,
}