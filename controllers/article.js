const article = require('../models/article');
const ServerError = require('../utils/errors/ServerError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const NotFoundError = require('../utils/errors/NotFoundError');
const { defaultErrorMessage, invalidNameMessage, invalidIdMessage, itemNotFoundMessage, invalidAccessMessage } = require('../utils/constants');

const defaultError = new ServerError(defaultErrorMessage);

module.exports.getArticles = (req, res, next) => {
  article.find({owner: req.user._id})
    .then(items => res.send(items))
    .catch(() => next(defaultError));
};

module.exports.createArticle = (req, res, next) => {
  const { source, title, text, link, image, date, keyword } = req.body;
  const owner = req.user._id;

  article.create({ source, title, text, link, image, date, keyword, owner })
    .then(item => res.send({
      _id: item._id,
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
        return next(new BadRequestError(invalidNameMessage));
      }
      return next(defaultError);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  article.findById(req.params.articleId)
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
        return next(new BadRequestError(invalidIdMessage));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError(itemNotFoundMessage));
      }
      if (err.message === 'Invalid Access') {
        return next(new ForbiddenError(invalidAccessMessage));
      }
      return next(defaultError);
    });
}