const AppError = require('../utils/appError');

const handleSequelizeValidationError = err => {
  const msg = err.message;
  return new AppError(msg, 400);
};

const handleSequelizeUniqueConstraintError = err => {
  const msg = err.errors[0].message;
  return new AppError(msg, 400);
};

const handleCastErrorDB = err => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new AppError(msg, 400);
};

const handleDuplicateFieldsDB = err => {
  const msg = `Duplicate field value: ${err.keyValue.name}. Please use another value`;
  return new AppError(msg, 400);
};

const handleValidatorErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again', 401);

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  //1) Log error
  console.error('ERROR 💥', err);
  //2) Send a generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong',
  });
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidatorErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (err.name === 'SequelizeUniqueConstraintError')
      error = handleSequelizeUniqueConstraintError(error);
    if (err.name === 'SequelizeValidationError') error = handleSequelizeValidationError(error);

    sendErrorProd(error, req, res);
  }
};
