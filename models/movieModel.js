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
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: 1888, msg: 'First movie was filmed in 1888' },
        max: { args: 2030, msg: 'Are you from future? :) Accepted years range 1888 - 2030' },
      },
    },
    format: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['VHS', 'DVD', 'Blu-Ray']],
          msg: 'Accepted formats: VHS, DVD, Blu-Ray',
        },
      },
    },
    actors: { type: DataTypes.JSON, allowNull: false },
  },
  { sequelize, modelName: 'movie' }
);

module.exports = Movie;
