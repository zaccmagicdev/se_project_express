const validator = require('validator');
const User = require('../models/user');
const { errorMessages } = require('../utils/errorMessages');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');

// getting all users in the database
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(OK).send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message }));
};


// getting a user by id
module.exports.getUser = (req, res) => {

  if (!validator.isMongoId(req.params.id)) {
    res.status(BAD_REQUEST).send({ message: errorMessages[res.statusCode].message })
  } else {
    User.findById(req.params.id)
      .orFail()
      .then(user => res.status(OK).send({ data: user }))
      .catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
          res.status(NOT_FOUND).send({ message: errorMessages[res.statusCode].message })
        } else {
          res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message })
        }
      });
  }
};


// creating a user to the database
module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(CREATED).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: errorMessages[res.statusCode].message })
      } else {
        res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message })
      }
    });
}
