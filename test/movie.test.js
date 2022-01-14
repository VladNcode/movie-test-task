require('dotenv').config({ path: './config.env' });
const request = require('supertest');
const app = require('../app');
const sequelize = require('../database');
const User = require('../models/userModel');
const Movie = require('../models/movieModel');
let { userOne, token, id, movieId } = require('./fixtures/config');

beforeAll(async () => {
  await sequelize.sync({ force: true }).then(() => console.log('DB is ready'));

  await User.create(userOne);

  const res = await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'pika@example.com', password: 'password' });

  token = res.body.token;
  id = res.body.data.user.id;
});

beforeEach(async () => {
  const res = await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Knocked Up',
      year: 2007,
      format: 'Blu-Ray',
      actors: ['Seth Rogen', 'Katherine Heigl', 'Paul Rudd', 'Leslie Mann'],
    })
    .set('Authorization', 'Bearer ' + token);

  movieId = res.body.data.movie.id;
});

afterEach(async () => {
  Movie.destroy({
    where: {},
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});

test('Should be able to create a new movie', async () => {
  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Get Shorty',
      year: 1889,
      format: 'DVD',
      actors: ['John Travolta', 'Danny DeVito', 'Renne Russo', 'Gene Hackman', 'Dennis Farina'],
    })
    .set('Authorization', 'Bearer ' + token)
    .expect(201);

  const movie = await Movie.findOne({ where: { title: 'Get Shorty' } });
  expect(movie.title).toEqual('Get Shorty');
});

test('Should NOT be able to create a new movie if unauthorized', async () => {
  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Get Shorty',
      year: 1889,
      format: 'DVD',
      actors: ['John Travolta', 'Danny DeVito', 'Renne Russo', 'Gene Hackman', 'Dennis Farina'],
    })
    .expect(401);

  const movie = await Movie.findOne({ where: { title: 'Get Shorty' } });
  expect(movie).toBe(null);
});

test('Should NOT be able to create a new movie with wrong year', async () => {
  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Get Shorty',
      year: 1887,
      format: 'DVD',
      actors: ['John Travolta', 'Danny DeVito', 'Renne Russo', 'Gene Hackman', 'Dennis Farina'],
    })
    .set('Authorization', 'Bearer ' + token)
    .expect(400);

  const movie = await Movie.findOne({ where: { title: 'Get Shorty' } });
  expect(movie).toBeNull();
});

test('Should NOT be able to create a new movie with wrong format', async () => {
  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Get Shorty',
      year: 1955,
      format: 'wrong',
      actors: ['John Travolta', 'Danny DeVito', 'Renne Russo', 'Gene Hackman', 'Dennis Farina'],
    })
    .set('Authorization', 'Bearer ' + token)
    .expect(400);

  const movie = await Movie.findOne({ where: { title: 'Get Shorty' } });
  expect(movie).toBeNull();
});

test('Should NOT be able to create a new movie with existing title', async () => {
  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Knocked Up',
      year: 1955,
      format: 'wrong',
      actors: ['John Travolta', 'Danny DeVito', 'Renne Russo', 'Gene Hackman', 'Dennis Farina'],
    })
    .set('Authorization', 'Bearer ' + token)
    .expect(400);
});

test('Should NOT be able to create a new movie with empty title or year', async () => {
  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: '',
      year: 1955,
      format: 'wrong',
      actors: ['John Travolta', 'Danny DeVito', 'Renne Russo', 'Gene Hackman', 'Dennis Farina'],
    })
    .set('Authorization', 'Bearer ' + token)
    .expect(400);

  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Get Shorty',
      year: '',
      format: 'wrong',
      actors: ['John Travolta', 'Danny DeVito', 'Renne Russo', 'Gene Hackman', 'Dennis Farina'],
    })
    .set('Authorization', 'Bearer ' + token)
    .expect(400);
});

test('Should NOT be able to create a new movie with no actors', async () => {
  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Get Shorty',
      year: 1955,
      format: 'DVD',
    })
    .set('Authorization', 'Bearer ' + token)
    .expect(400);

  const movie = await Movie.findOne({ where: { title: 'Get Shorty' } });
  expect(movie).toBeNull();
});

test('Should be able to delete movie', async () => {
  await request(app)
    .delete(`/api/v1/movies/${movieId}`)
    .set('Authorization', 'Bearer ' + token)
    .expect(204);

  const movie = await Movie.findOne({ where: { title: 'Knocked Up' } });
  expect(movie).toBeNull();

  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Knocked Up',
      year: 2007,
      format: 'Blu-Ray',
      actors: ['Seth Rogen', 'Katherine Heigl', 'Paul Rudd', 'Leslie Mann'],
    })
    .set('Authorization', 'Bearer ' + token);
});

test('Should be able to delete movie if unauthorized', async () => {
  await request(app).delete(`/api/v1/movies/${movieId}`).expect(401);

  const movie = await Movie.findOne({ where: { title: 'Knocked Up' } });
  expect(movie).not.toBeNull();
});

test('Should be able to update a new movie', async () => {
  await request(app)
    .patch(`/api/v1/movies/${movieId}/`)
    .send({
      year: 1900,
    })
    .set('Authorization', 'Bearer ' + token)
    .expect(200);

  const movie = await Movie.findOne({ where: { id: movieId } });
  expect(movie.year).toEqual(1900);
});

test('Should NOT be able to update a new movie if unauthorized', async () => {
  await request(app)
    .patch(`/api/v1/movies/${movieId}/`)
    .send({
      year: 1900,
    })
    .expect(401);

  const movie = await Movie.findOne({ where: { id: movieId } });
  expect(movie.year).toEqual(2007);
});

test('Should be able get a single movie', async () => {
  const res = await request(app)
    .get(`/api/v1/movies/${movieId}/`)
    .set('Authorization', 'Bearer ' + token)
    .expect(200);

  expect(res.body.data.movie.year).toEqual(2007);
});

test('Should NOT be able get a single movie if unauthorized', async () => {
  await request(app).get(`/api/v1/movies/${movieId}/`).expect(401);
});

test('Should NOT be able to import movies if unauthorized', async () => {
  await request(app).post(`/api/v1/movies/import/`).expect(401);
});

test('Should be able to get filtered movies', async () => {
  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Jaws',
      year: 1975,
      format: 'DVD',
      actors: ['Roy Scheider', 'Robert Shaw', 'Richard Dreyfuss', 'Lorraine Gary'],
    })
    .set('Authorization', 'Bearer ' + token);

  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Harvey',
      year: 1950,
      format: 'DVD',
      actors: ['James Stewart', 'Josephine Hull', 'Peggy Dow', 'Charles Drake'],
    })
    .set('Authorization', 'Bearer ' + token);

  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Casablanca',
      year: 1942,
      format: 'DVD',
      actors: ['Humphrey Bogart', 'Ingrid Bergman', 'Claude Rains', 'Peter Lorre'],
    })
    .set('Authorization', 'Bearer ' + token);

  await request(app)
    .post('/api/v1/movies/')
    .send({
      title: 'Young Frankenstein',
      year: 1974,
      format: 'VHS',
      actors: ['Gene Wilder', 'Kenneth Mars', 'Terri Garr', 'Gene Hackman', 'Peter Boyle'],
    })
    .set('Authorization', 'Bearer ' + token);

  let res = await request(app)
    .get('/api/v1/movies?actor=Peter')
    .set('Authorization', 'Bearer ' + token);

  expect(res.body.results).toBe(2);

  res = await request(app)
    .get('/api/v1/movies')
    .set('Authorization', 'Bearer ' + token);
  expect(res.body.results).toBe(5);

  res = await request(app)
    .get('/api/v1/movies?limit=1')
    .set('Authorization', 'Bearer ' + token);
  expect(res.body.results).toBe(1);

  res = await request(app)
    .get('/api/v1/movies?search=Casa')
    .set('Authorization', 'Bearer ' + token);
  expect(res.body.data.movies[0].title).toBe('Casablanca');

  res = await request(app)
    .get('/api/v1/movies?sort=title&order=DESC')
    .set('Authorization', 'Bearer ' + token);
  expect(res.body.data.movies[0].title).toBe('Young Frankenstein');
});
