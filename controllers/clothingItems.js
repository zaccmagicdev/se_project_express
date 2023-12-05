const ClothingItem = require('../models/clothingItem');
const validator = require('validator');
const { errors } = require('../utils/errors');

//adding a clothing item to the database
module.exports.addItem = (req, res) => {

  const { name, imageUrl, weather } = req.body;

  ClothingItem.create({ name, imageUrl, weather, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: errors[res.statusCode].message })
      } else {
        res.status(500).send({ message: errors[res.statusCode].message })
      }
    });
};



//getting all items in the database
module.exports.getItems = (req, res) => {
  ClothingItem.find({})
    .then(items => res.send({ data: items }))
    .catch(() => res.status(500).send({ message: errors[res.statusCode].message }));
};


//removing an item from the database
module.exports.removeItembyId = (req, res) => {

  if (!validator.isMongoId(req.params.id)) {
    res.status(400).send({ message: errors[res.statusCode].message })
  } else {
    ClothingItem.findByIdAndRemove(req.params.id)
      .orFail()
      .then(item => res.send({ data: item }))
      .catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
          res.status(404).send({ message: errors[res.statusCode].message })
        } else {
          res.status(500).send({ message: errors[res.statusCode].message })
        }
      });
  }
};


//liking an item in the database
module.exports.likeItem = (req, res) => {

  if (!validator.isMongoId(req.params.id)) {
    res.status(400).send({ message: errors[res.statusCode].message })
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
          res.status(404).send({ message: errors[res.statusCode].message })
        } else {
          res.status(500).send({ message: errors[res.statusCode].message })
        }
      });
  }
};


//unliking an item in the database
module.exports.unlikeItem = (req, res) => {
  if (!validator.isMongoId(req.params.id)) {
    res.status(400).send({ message: errors[res.statusCode].message })
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
          res.status(404).send({ message: errors[res.statusCode].message })
        } else {
          res.status(500).send({ message: errors[res.statusCode].message })
        }
      });
  }
};
