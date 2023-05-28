const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { privateKey } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const authorizationError = new UnauthorizedError('Authorization Error');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(authorizationError);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : privateKey);
  } catch (err) {
    return next(authorizationError);
  }

  req.user = payload;

  return next();
};