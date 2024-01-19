const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errorMessages } = require('../utils/errorMessages');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR, DUPLICATION_ERROR, AUTHORIZATION_ERROR } = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');


// getting all users in the database
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(OK).send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message }));
};


// getting a user by id
module.exports.getCurrentUser = (req, res) => {

  User.findById(req.user._id)
    .orFail()
    .then(user => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: errorMessages[res.statusCode].message })
      } else {
        res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message })
      }
    });
};


// creating a user to the database
module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  console.log(req.body)

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          res.status(CREATED).send({ name: user.name, avatar: user.avatar, email: user.email, id: user._id })
        })
        .catch((err) => {
          console.log(err)
          if (err.name === 'ValidationError') {
            res.status(BAD_REQUEST).send({ message: errorMessages[res.statusCode].message })
          } else if (err.name === 'MongoServerError') {
            res.status(DUPLICATION_ERROR).send({ message: errorMessages[res.statusCode].message })
          } else {
            res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message })
          }
        });
    }).catch(() => res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message }))
}

// logging in
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user)
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'Incorrect email or password') {
        res.status(AUTHORIZATION_ERROR).send({ message: errorMessages[res.statusCode].message })
      } else {
        res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message })
      }
    });
}

module.exports.updateinfo = (req, res) => {

  User.findByIdAndUpdate(req.user._id, { name: req.body.name, avatar: req.body.avatar }, { new: true, runValidators: true })
    .orFail()
    .then(user => res.status(OK).send({ name: req.body.name, avatar: req.body.avatar, email: user.email, id: user._id }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: errorMessages[res.statusCode].message })
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: errorMessages[res.statusCode].message })
      } else {
        res.status(SERVER_ERROR).send({ message: errorMessages[res.statusCode].message })
      }
    })
};