const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

// jwt.sign ( id, secret, expiresIn)
const signToken = id =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarderd-proto'] === 'https',
  });

  // Remove the password from the output
  user.password = undefined;
  user.confirmPassword = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.password.length < 8 || req.body.password.length > 24) {
    return next(new AppError('Passwords must be between 8 and 24 characters', 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new AppError('Passwords does not match', 400));
  }

  // const salt = await bcrypt.genSalt(12);
  // cryptoPassword = await bcrypt.hash(req.body.password, salt);

  // 1) create a newUser from body data
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: cryptoPassword,
  });
  createSendToken(newUser, 201, req, res);
});
