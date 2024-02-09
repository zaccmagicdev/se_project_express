const validator = require('validator');
const ClothingItem = require('../models/clothingItem');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// adding a clothing item to the database
module.exports.addItem = (req, res, next) => {

  const { name, imageUrl, weather } = req.body;

  ClothingItem.create({ name, imageUrl, weather, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('The request you are trying to make is invalid'))
      } else {
        next(err)
      }
    });
};



// getting all items in the database
module.exports.getItems = (req, res, next) => {
  ClothingItem.find({})
    .then(items => res.send({ data: items }))
    .catch((err) => next(err));
};


// removing an item from the database
module.exports.removeItembyId = (req, res, next) => {

  if (!validator.isMongoId(req.params.id)) {
    throw new BadRequestError('No items with that ID were found. Please enter a valid one')
  } else {
    ClothingItem.findById(req.params.id)
      .orFail()
      .then((item) => {
        if (req.user._id === item.owner.toHexString()) {
          ClothingItem.findByIdAndRemove(req.params.id)
            .orFail()
            .then(() => {
              res.send({ data: item })
            })
            .catch((err) => {
              if (err.name === 'DocumentNotFoundError') {
                next(new NotFoundError('No such item exists. Please make sure the user you want to delete exists'))
              } else {
                next(err)
              }
            });
        } else {
          next(new ForbiddenError('You do not have the authorization to make that request'))
        }
      }).catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
          next(new NotFoundError('No such item exists. Please make sure the user you want to delete exists'))
        } else {
          next(err)
        }
      });
  }
};


// liking an item in the database
module.exports.likeItem = (req, res, next) => {

  if (!validator.isMongoId(req.params.id)) {
    throw new BadRequestError('No items with that ID were found. Please enter a valid one')
  } else {
    ClothingItem.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail()
      .then(item => res.send({ data: item }))
      .catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
          next(new NotFoundError('No such item exists. Please make sure the user you want to delete exists'))
        } else {
          next(err)
        }
      });
  }
};


// unliking an item in the database
module.exports.unlikeItem = (req, res, next) => {
  if (!validator.isMongoId(req.params.id)) {
    throw new BadRequestError('No items with that ID were found. Please enter a valid one')
  } else {
    ClothingItem.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail()
      .then(item => res.send({ data: item }))
      .catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
          next(new NotFoundError('No such item exists. Please make sure the user you want to delete exists'))
        } else {
         next(err)
        }
      });
  }
};
