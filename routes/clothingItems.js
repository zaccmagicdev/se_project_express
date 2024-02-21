const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { validateId, validateCardBody } = require('../middlewares/validation')
const { addItem, getItems, removeItembyId, likeItem, unlikeItem } = require('../controllers/clothingItems');
const auth = require('../middlewares/auth');

router.post('/', auth, validateCardBody,addItem);
router.get('/', getItems);
router.delete('/:id', auth, validateId, removeItembyId)
router.delete('/:id/likes', auth, validateId, unlikeItem)
router.put('/:id/likes', auth, validateId, likeItem)

module.exports = router;