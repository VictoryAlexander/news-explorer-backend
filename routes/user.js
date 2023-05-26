const router = require('express').Router();
const { getCurrentUser, createUser, login } = require('../controllers/user');
const auth = require('../middleware/auth');
const { validateNewUser, validateExistingUser } = require('../middleware/validation');

router.get('/users/me', auth, getCurrentUser);
router.post('/signup', validateNewUser, createUser);
router.post('/signin', validateExistingUser, login);

module.exports = router;