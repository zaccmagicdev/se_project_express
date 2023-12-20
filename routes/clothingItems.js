const router = require('express').Router();
const { addItem, getItems, removeItembyId, likeItem, unlikeItem } = require('../controllers/clothingItems');
const auth = require('../middlewares/auth');

router.post('/', auth, addItem);
router.get('/', getItems);
router.delete('/:id', auth, removeItembyId)
router.delete('/:id/likes', auth, unlikeItem)
router.put('/:id/likes', auth, likeItem)

module.exports = router;