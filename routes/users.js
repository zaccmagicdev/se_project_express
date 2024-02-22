const router = require('express').Router();
const auth = require('../middlewares/auth');

const { getCurrentUser, updateinfo } = require('../controllers/users');
const { validateUserUpdateEvent } = require('../middlewares/validation');

router.patch('/me', auth,validateUserUpdateEvent, updateinfo);
router.get('/me', auth, getCurrentUser)

module.exports = router;