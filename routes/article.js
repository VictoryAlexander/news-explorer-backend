const router = require('express').Router();
const { getArticles, createArticle, deleteArticle } = require('../controllers/article');
const auth = require('../middleware/auth');
const { validateNewArticle, validateArticleId } = require('../middleware/validation');

router.get('/articles', auth, getArticles);
router.post('/articles', auth, validateNewArticle, createArticle);
router.delete('/articles/:articleId', auth, validateArticleId, deleteArticle);

module.exports = router;