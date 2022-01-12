const { Movie, Actor } = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');
const fs = require('fs');

// fs.readFile(__dirname + '/../movies.txt', async (error, data) => {
//   if (error) {
//     throw error;
//   }
//   const movie = await Movie.create({
//     title: data.toString().split('\n\n')[0].split('\n')[0],
//     year: data.toString().split('\n\n')[0].split('\n')[1],
//     format: data.toString().split('\n\n')[0].split('\n')[2],
//     actors: data.toString().split('\n\n')[0].split('\n')[3],
//   });

//   // return data.toString().split('\n\n')[0].split('\n');
//   // console.log(data.toString().split('\n\n')[0].split('\n'));
// });

exports.create = catchAsync(async (req, res, next) => {
  const actors = req.body.actors;

  // const movie = await Movie.create({
  //   title: req.body.title,
  //   year: req.body.year,
  //   format: req.body.format,
  //   actors,
  // });

  let tours = fs.readFileSync(`${__dirname}/../movies.txt`, 'utf-8');

  tours = tours.trim().replace(/(title: |year: |format: |actors: )/g, '');
  console.log(tours.split('\n\n').length);

  for (let i = 0; i < tours.length - 1; i++) {
    let arr = [];
    tours
      .split('\n\n')
      [i].split('\n')[3]
      .split(',')
      .forEach(star => arr.push(star.replace(/^ /, '')));
    // arr.push(tours.split('\n\n')[i].split('\n')[3].split(','));
    await Movie.create({
      title: tours.split('\n\n')[i].split('\n')[0],
      year: tours.split('\n\n')[i].split('\n')[1],
      format: tours.split('\n\n')[i].split('\n')[2],
      actors: arr,
      // actors: `["${tours.split('\n\n')[i].split('\n')[3].replace(/, /g, '", "')}"]`,
    });
  }

  // console.log(tours.split('\n\n')[0].split('\n')[3]);

  // const movie = await Movie.create({
  //   title: tours.split('\n\n')[0].split('\n')[4],
  //   year: tours.split('\n\n')[0].split('\n')[5],
  //   format: tours.split('\n\n')[0].split('\n')[6],
  //   actors: tours.split('\n\n')[0].split('\n')[7],
  // });

  res.status(201).json({
    status: 'success',
    data: {
      data: movie,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  console.log(req.query.actor);
  // const movies = await Movie.findAll();
  const movies = await Movie.findAll({ where: { actors: { [Op.substring]: req.query.actor } } });

  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: {
      movies,
    },
  });
});
