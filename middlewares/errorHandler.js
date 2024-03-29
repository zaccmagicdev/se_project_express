const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode).send({message: err.message});
};

module.exports = errorHandler;