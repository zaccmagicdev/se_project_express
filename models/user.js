const mongoose = require('mongoose');
const validator = require('validator');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Please enter a valid Email address',
    },
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

userSchema.statics.findUserByCredentials =
  function findUserByCredentials(email, password) {

    return this.findOne({ email }).select('+password')
      .then((user) => {
        if (!user) {
          return Promise.reject(new Error('Incorrect password or email'));
        }

        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              return Promise.reject(new Error('Incorrect password or email'));
            }

            return user;
          });
      });
  };

module.exports = mongoose.model('user', userSchema);