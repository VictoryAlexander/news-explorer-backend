const router = require('express').Router();
const article = require('./article');
const user = require('./user');
const NotFoundError = require('../utils/errors/NotFoundError');

router.use('/', article);
router.use('/', user);
router.use((req, res, next) => {
  next(new NotFoundError('Router not found'));
});

module.exports = router;