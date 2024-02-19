const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require("cors");
const errorHandler = require('./middlewares/errorHandler');
const { Joi, celebrate, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3001 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(requestLogger);
app.use(helmet());

app.use('/users', require('./routes/users'));

app.use('/items', require('./routes/clothingItems'))

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().unique().required(),
    password: Joi.string().required()
  }), createUser
}));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  }), login
}));

app.use('*', (req, res) => {
  throw new NotFoundError('The resource you are looking for does not exist. Please enter a valid link')
})

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(errorHandler);
app.use(errors());
app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`This server is running on port ${PORT}`)
});