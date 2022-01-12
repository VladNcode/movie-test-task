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
  const token = signToken(user.id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarderd-proto'] === 'https',
  });

  const { email, username } = user;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        username,
        email,
      },
    },
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.password.length < 8 || req.body.password.length > 24) {
    return next(new AppError('Passwords must be between 8 and 24 characters', 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new AppError('Passwords does not match', 400));
  }

  const salt = await bcrypt.genSalt(12);
  const cryptoPassword = await bcrypt.hash(req.body.password, salt);

  // 1) create a newUser from body data
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: cryptoPassword,
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
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Please enter correct email and password', 401));
  }

  // 4) If everything is ok, send token to client
  createSendToken(user, 200, req, res);
});
