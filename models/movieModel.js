const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Movie extends Model {}
Movie.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { args: [true], msg: 'Movie with this title already exists' },
      validate: {
        len: {
          args: [1, 100],
          msg: 'Title length must be between 6 and 50 characters',
        },
      },
    },
    year: { type: DataTypes.INTEGER, allowNull: false },
    format: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['VHS', 'DVD', 'Blu-Ray']],
      },
    },
    actors: { type: DataTypes.JSON },
  },
  { sequelize, modelName: 'movie' }
);

class Actor extends Model {}
Actor.init(
  {
    fullname: { type: DataTypes.STRING },
    // movies: { type: DataTypes.JSON },
  },
  { sequelize, modelName: 'actor' }
);

module.exports = { Movie, Actor };
