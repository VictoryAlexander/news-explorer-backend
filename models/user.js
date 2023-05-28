const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const user = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Invalid Email',
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30
  },
});

user.statics.findUserByCredentials = function findUserByCredentials (email, password) {
  return this.findOne({ email }).select('+password')
  .then((userInfo) => {
    if (!userInfo) {
      return Promise.reject(new Error('Incorrect email or password'));
    }
    return bcrypt.compare(password, userInfo.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Incorrect email or password'));
        }
        return userInfo;
      })
  })
}

module.exports = mongoose.model('user', user);