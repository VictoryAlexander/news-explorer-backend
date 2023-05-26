const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const ServerError = require('../utils/errors/ServerError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictError = require('../utils/errors/ConflictError');
const NotFoundError = require('../utils/errors/NotFoundError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const defaultError = new ServerError('An error has occurred on the server.');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  user.find({})
    .then( userInfo => res.send({ userInfo }))
    .catch(() => next(defaultError));
};
  
module.exports.getCurrentUser = (req, res, next) => {
  user.findById(req.user._id)
    .then((userInfo) => {
      if (!userInfo) {
        return next(new NotFoundError("User not found"));
      }
      return res.send({ userInfo });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user id"));
      } else {
        next(defaultError);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => user.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((userInfo) => {
      res.send({
        _id: userInfo._id,
        email: userInfo.email,
        name: userInfo.name
      })
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid user id"));
      } else if(err.code === 11000) {
        next(new ConflictError('User Already Exists'));
      } else {
        next(defaultError);
      }
    })
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  
  return user.findUserByCredentials(email, password)
    .then((userInfo) => {
      const token = jwt.sign({ _id: userInfo._id }, NODE_ENV === 'production' ? JWT_SECRET : 'HE DOESNT KNOW', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Authorization Error'));
    });
};