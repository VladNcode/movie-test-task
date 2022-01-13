const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcrypt');
const AppError = require('../utils/appError');

class User extends Model {}
User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { args: [true], msg: 'This username is already in use' },
      validate: {
        len: {
          args: [6, 24],
          msg: 'Name must be at least 6 characters long and not more than 24 characters long',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { args: [true], msg: 'This email address is already in use' },
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 30],
          msg: 'Password must be between 8 and 30 characters long',
        },
      },
    },
    confirmPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEqual(val) {
          if (val !== this.password) throw new Error('Passwords does not match');
        },
      },
    },
  },
  { sequelize, modelName: 'user' }
);

User.beforeCreate(async function (user) {
  try {
    const salt = await bcrypt.genSalt(12);
    const cryptoPassword = await bcrypt.hash(user.password, salt);

    user.password = cryptoPassword;
    user.confirmPassword = '';
  } catch (e) {
    throw new AppError('We failed to encrypt your password, please try again later', 400);
  }
});

User.validatePassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = User;
