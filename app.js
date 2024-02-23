require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require("cors");
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateUserBody, validateLogin } = require('./middlewares/validation')
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3001 } = process.env;

const app = express();

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(requestLogger);

app.use(helmet());

app.use('/users', require('./routes/users'));

app.use('/items', require('./routes/clothingItems'))

app.post('/signup', validateUserBody, createUser);

app.post('/signin', validateLogin, login);


app.use('*', () => {
  throw new NotFoundError('The resource you are looking for does not exist. Please enter a valid link')
})

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {

  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message
    });
});

app.listen(PORT, () => {
  console.log(`This server is running on port ${PORT}`)
});