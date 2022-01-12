const express = require('express');
const morgan = require('morgan');

const app = express();

const userRouter = require('./routes/userRoutes');

//* Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//* Body parser, reading from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/v1/users', userRouter);

module.exports = app;
