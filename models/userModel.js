const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcrypt');

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
    },
    confirmPassword: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, modelName: 'user' }
);

module.exports = User;
