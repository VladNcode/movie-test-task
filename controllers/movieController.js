const { Movie, Actor, Junction } = require('../models/movieModel');
// const Actor = require('../models/actorModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.create = catchAsync(async (req, res, next) => {
  const actors = req.body.actors;

  const movie = await Movie.create({
    title: req.body.title,
    year: req.body.year,
    format: req.body.format,
    actors,
  });

  // for (let i = 0; i < actors.length; i++) {
  // await Actor.findOne({ where: { fullname: actors[i] } }).then(function (obj) {
  //   // update
  //   if (obj) {
  //     console.log(obj.movieId);
  //     return obj.update({ movieId: (obj.movieId += movie.Id) });
  //   }
  //   // insert
  //   return Actor.create({
  //     fullname: actors[i],
  //     movieId: [movie.id],
  //   });
  // });
  // await Actor.create({
  //   fullname: actors[i],
  //   movieId: movie.id,
  // });
  // }

  for (let i = 0; i < actors.length; i++) {
    await Actor.create({
      fullname: actors[i],
      movieId: movie.id,
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: movie,
    },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const movies = await Movie.findAll();

  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: {
      movies,
    },
  });
});
