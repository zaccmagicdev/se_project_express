const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then(users => res.send({data: users}))
  .catch(err => res.status(500).send({message: err.message}));
};

module.exports.getUser = (req, res) => {

  User.findById(req.params.id)
  .orFail(() => {
    const error = new Error("Item ID not found");
    error.statusCode = 404;
    throw error;
  })
  .then(user => res.send({data: user}))
  .catch(err => res.status(400).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({name, avatar})
  .then(user => res.send({data: user}))
  .catch(err => res.status(400).send({message: err.message}));
}