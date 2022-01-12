const express = require('express');
const morgan = require('morgan');

const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const movieRouter = require('./routes/movieRoutes');

//* Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//* Body parser, reading from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/movies', movieRouter);

//* If code reaches this point, it will be executed
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
