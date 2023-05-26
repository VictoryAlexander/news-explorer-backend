const article = require('../models/article');
const ServerError = require('../utils/errors/ServerError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const NotFoundError = require('../utils/errors/NotFoundError');

const defaultError = new ServerError('An error has occurred on the server.');

module.exports.getArticles = (req, res, next) => {
  article.find({})
    .then(items => res.send(items))
    .catch(() => next(defaultError));
};

module.exports.createArticle = (req, res, next) => {
  const { source, title, text, link, image, date, keyword } = req.body;
  const owner = req.user._id;

  article.create({ source, title, text, link, image, date, keyword, owner })
    .then(item => res.send({
      source: item.source,
      title: item.title,
      text: item.text,
      link: item.link,
      image: item.image,
      date: item.date,
      keyword: item.keyword
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid Name'));
      }
      return next(defaultError);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  article.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new Error('Invalid Access');
      }
      return item.deleteOne().then(() => res
        .status(200)
        .send(item));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid Id'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Item ID not found'));
      }
      if (err.message === 'Invalid Access') {
        return next(new ForbiddenError('Invalid authorization'));
      }
      return next(defaultError);
    });
}