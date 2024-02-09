const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');


// getting all users in the database
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch((err) => next(err));
};


// getting a user by id
module.exports.getCurrentUser = (req, res, next) => {

  User.findById(req.user._id)
    .orFail()
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('The user you requested to find does not exist in the database. Please enter one that does.'))
      } else {
        next(err)
      }
    });
};


// creating a user to the database
module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  console.log(req.body)

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          res.send({ name: user.name, avatar: user.avatar, email: user.email, id: user._id })
        })
        .catch((err) => {
          console.log(err)
          if (err.name === 'ValidationError') {
            next(new BadRequestError('The request you are trying to make is invalid'))
          } else if (err.name === 'MongoServerError') {
            next(new ConflictError('A parameter in the request already matches one with the database. Please check the log for details'))
          } else {
            next(err)
          }
        });
    })
    .catch((err) => next(err))
}

// logging in
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user)
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'Incorrect email or password') {
        next(new UnauthorizedError('The email or password that was entered was incorrect.'))
      } else {
        next(err)
      }
    });
}

module.exports.updateinfo = (req, res, next) => {

  User.findByIdAndUpdate(req.user._id, { name: req.body.name, avatar: req.body.avatar }, { new: true, runValidators: true })
    .orFail()
    .then(user => res.send({ name: req.body.name, avatar: req.body.avatar, email: user.email, _id: user._id }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('The request you are trying to make is invalid'))
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('The user you requested to find does not exist in the database. Please enter one that does.'))
      } else {
        next(err)
      }
    })
};