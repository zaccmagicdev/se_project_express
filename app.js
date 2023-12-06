const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { NOT_FOUND } = require('./utils/errors');

const { errorMessages } = require('./utils/errorMessages');

const {PORT = 3001} = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '656cbd5cc0a5e4dd0246c74b'
  };
  next();
});


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(helmet());

app.use('/users', require('./routes/users'));

app.use('/items', require('./routes/clothingItems'))

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({message: errorMessages[res.statusCode].message})
})

app.listen(PORT, () => {
  console.log(`This server is running on port ${PORT}`)
});