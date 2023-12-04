const User = require('../models/user');
const validator = require('validator');
const { errors } = require('../utils/errors');


//getting all users in the database
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: errors[res.statusCode].message }));
};


//getting a user by id
module.exports.getUser = (req, res) => {

  if (!validator.isMongoId(req.params.id)) {
    res.status(400).send({ message: 'Please enter a valid Id' })
  } else {
    User.findById(req.params.id)
      .orFail(() => {
        const error = new Error("Item ID not found");
        throw error;
      })
      .then(user => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'Error') {
          res.status(404).send({ message: errors[res.statusCode].message })
        } else {
          res.status.status(500).send({ message: errors[res.statusCode].message })
        }
      });
  }
};


//creating a user to the database
module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: errors[res.statusCode].message })
      } else {
        res.status.status(500).send({ message: errors[res.statusCode].message })
      }
    });
}