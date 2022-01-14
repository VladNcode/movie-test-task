const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const movieRouter = require('./routes/movieRoutes');

//* Set security HTTP headers
app.use(helmet());

//* Limit requests from same IP
const limiter = rateLimit({
  max: 100, // requests from the same ip
  windowMs: 60 * 60 * 1000, // 1
  message: 'Too many requests from this ip, please try again in an hour!',
});
app.use('/api/', limiter);

//* Data sanitization againts XSS
app.use(xss());

//* Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//* Body parser, reading from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//* Maintenance mode
// app.use((req, res, next) => {
//   res.status(503).json({
//     status: 'Maintenance',
//     message: 'API is currently under maintenance, we will be back in 2 hours!',
//   });
// });

app.use('/api/v1/users', userRouter);
app.use('/api/v1/movies', movieRouter);

//* If code reaches this point, it will be executed
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
