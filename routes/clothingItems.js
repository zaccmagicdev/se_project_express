const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { addItem, getItems, removeItembyId, likeItem, unlikeItem } = require('../controllers/clothingItems');
const auth = require('../middlewares/auth');

router.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    url: Joi.string().required()
  })
}),addItem);
router.get('/', getItems);
router.delete('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24)
  })
}), removeItembyId)
router.delete('/:id/likes', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24)
  })
}), unlikeItem)
router.put('/:id/likes', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24)
  })
}), likeItem)

module.exports = router;