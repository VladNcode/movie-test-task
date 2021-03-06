const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

// jwt.sign ( id, secret, expiresIn)
const signToken = id =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id);

  const { id, email, username } = user;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        id,
        username,
        email,
      },
    },
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and checking if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findOne({
    where: {
      id: decoded.id,
    },
  });

  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) Check if email and password exist
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please enter email and password', 400));
  }

  // 2) Find user
  const user = await User.findOne({ where: { email } });
  if (!user) return next(new AppError('Please enter correct email and password', 401));

  // 3) Check if password is valid
  if (!(await User.validatePassword(password, user.password))) {
    return next(new AppError('Please enter correct email and password', 401));
  }

  // 4) If everything is ok, send token to client
  createSendToken(user, 200, req, res);
});
