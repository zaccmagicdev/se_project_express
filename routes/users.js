const router = require('express').Router();
const auth = require('../middlewares/auth');

const { getCurrentUser, updateinfo } = require('../controllers/users');

router.patch('/me', auth, updateinfo);
router.get('/me', auth, getCurrentUser)

module.exports = router;