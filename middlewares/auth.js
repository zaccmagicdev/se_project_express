const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { AUTHORIZATION_ERROR } = require('../utils/errors');
const { errorMessages } = require('../utils/errorMessages');

const handleAuthError = (res) => {
  res
    .status(AUTHORIZATION_ERROR)
    .send({ message: errorMessages[res.statusCode].message });
};

/* const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
}; */

function extractBearerToken(header){
  return header.replace('Bearer ', '');
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();

  return false;
};