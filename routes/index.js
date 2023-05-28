const router = require('express').Router();
const article = require('./article');
const user = require('./user');
const NotFoundError = require('../utils/errors/NotFoundError');
const { routerNotFoundMessage } = require('../utils/constants');

router.use('/', article);
router.use('/', user);
router.use((req, res, next) => {
  next(new NotFoundError(routerNotFoundMessage));
});

module.exports = router;