const fs = require('fs');
const { Op } = require('sequelize');
const { Movie } = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.import = catchAsync(async (req, res) => {
  let movies = fs.readFileSync(`${__dirname}/../sample.txt`, 'utf-8');
  movies = movies.trim().replace(/(Title: |Release Year: |Format: |Stars: )/g, '');
  const length = movies.split('\n\n').length;
  // console.log(length);

  for (let i = 0; i < length; i++) {
    let arr = [];
    let data = tours.split('\n\n')[i].split('\n');
    data[3].split(',').forEach(star => arr.push(star.replace(/^ /, '')));

    await Movie.create({
      title: data[0],
      year: data[1],
      format: data[2],
      actors: arr,
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: 'hello',
    },
  });
});

exports.list = catchAsync(async (req, res) => {
  const allowedSort = ['id', 'title', 'year'];
  const allowedOrder = ['ASC', 'DESC'];
  const sort = allowedSort.includes(req.query.sort) ? req.query.sort : 'id';
  const order = allowedOrder.includes(req.query.order) ? req.query.order : 'ASC';
  const limit = req.query.limit > 0 && req.query.limit < 100 ? req.query.limit : 20;
  const offset = req.query.offset > 0 && req.query.offset < 100000 ? req.query.offset : 0;

  const query = {
    order: [[sort, order]],
    limit,
    offset,
  };

  if (req.query.actor && req.query.search) {
    query.where = {
      actors: { [Op.substring]: req.query.actor },
      title: { [Op.substring]: req.query.search },
    };
  }

  if (req.query.actor) {
    query.where = { actors: { [Op.substring]: req.query.actor } };
  }

  if (req.query.search) {
    query.where = {
      [Op.or]: [
        { actors: { [Op.substring]: req.query.search } },
        { title: { [Op.substring]: req.query.search } },
      ],
    };
  }

  const movies = await Movie.findAll(query);

  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: {
      movies,
    },
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const movie = await Movie.create({
    title: req.body.title,
    year: req.body.year,
    format: req.body.format,
    actors: req.body.actors,
  });

  res.status(201).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

exports.show = catchAsync(async (req, res) => {});
exports.update = catchAsync(async (req, res) => {});
exports.delete = catchAsync(async (req, res) => {});
