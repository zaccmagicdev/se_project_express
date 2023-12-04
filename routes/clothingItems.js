const router = require('express').Router();
const { addItem, getItems, removeItembyId, likeItem, unlikeItem } = require('../controllers/clothingItems');

router.post('/', addItem);
router.get('/', getItems);
router.delete('/:id', removeItembyId)
router.delete('/:id/likes', unlikeItem)
router.put('/:id/likes', likeItem)

module.exports = router;