const mongoose = require('mongoose');
const validator = require('validator');

const article = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'invalid URL',
    }
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'invalid URL',
    }
  },
  date: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('article', article);