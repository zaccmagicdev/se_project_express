const validator = require('validator');
const ClothingItem = require('../models/clothingItem');
const { errorMessages } = require('../utils/errorMessages');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR, FORBIDDEN } = require('../utils/errors');

// adding a clothing item to the database
module.exports.addItem = (req, res) => {

  const { name, imageUrl, weather } = req.body;

  ClothingItem.create({ name, imageUrl, weather, owner: req.user._id })
    .then((item) => {
      res.status(CREATED).send({ data: item });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: errorMessages[res.statusCode].message })
      } else {
        res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message })
      }
    });
};



// getting all items in the database
module.exports.getItems = (req, res) => {
  ClothingItem.find({})
    .then(items => res.status(OK).send({ data: items }))
    .catch(() => res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message }));
};


// removing an item from the database
module.exports.removeItembyId = (req, res) => {

  if (!validator.isMongoId(req.params.id)) {
    res.status(BAD_REQUEST).send({ message: errorMessages[res.statusCode].message })
  } else {
    ClothingItem.findById(req.params.id)
      .orFail()
      .then((item) => {
        if (req.user._id === item.owner.toHexString()) {
          ClothingItem.findByIdAndRemove(req.params.id)
            .orFail()
            .then(() => {
              res.status(OK).send({ data: item })
            })
            .catch((err) => {
              if (err.name === 'DocumentNotFoundError') {
                res.status(NOT_FOUND).send({ message: errorMessages[res.statusCode].message })
              } else {
                res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message })
              }
            });
        } else {
          res.status(FORBIDDEN).send({ message: errorMessages[res.statusCode].message })
        }
      }).catch((err) => {
        if(err.name === 'DocumentNotFoundError'){
          res.status(NOT_FOUND).send({ message: errorMessages[res.statusCode].message })
        } else {
          res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message })
        }
      });
  }
};


// liking an item in the database
module.exports.likeItem = (req, res) => {

  if (!validator.isMongoId(req.params.id)) {
    res.status(BAD_REQUEST).send({ message: errorMessages[res.statusCode].message })
  } else {
    ClothingItem.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail()
      .then(item => res.status(CREATED).send({ data: item }))
      .catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
          res.status(NOT_FOUND).send({ message: errorMessages[res.statusCode].message })
        } else {
          res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message })
        }
      });
  }
};


// unliking an item in the database
module.exports.unlikeItem = (req, res) => {
  if (!validator.isMongoId(req.params.id)) {
    res.status(BAD_REQUEST).send({ message: errorMessages[res.statusCode].message })
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
          res.status(NOT_FOUND).send({ message: errorMessages[res.statusCode].message })
        } else {
          res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message })
        }
      });
  }
};
