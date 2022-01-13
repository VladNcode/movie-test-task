require('dotenv').config({ path: './config.env' });
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const app = require('../app');
const sequelize = require('../database');
const User = require('../models/userModel');
let { userOne, userTwo, token, id } = require('./fixtures/config');

beforeAll(async () => {
  await sequelize.sync({ force: true }).then(() => console.log('DB is ready'));
});

beforeEach(async () => {
  await User.create(userOne);

  const res = await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'pika@example.com', password: 'password' });

  // console.log(res.body.token);

  token = res.body.token;
  id = res.body.data.user.id;

  // console.log(token, id);
});

afterEach(async () => {
  await User.destroy({
    where: {
      id: id,
    },
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});

test('Should be able to signup a new user', async () => {
  const res = await request(app).post('/api/v1/users/signup/').send(userTwo).expect(201);

  const user = await User.findOne({ where: { email: 'testing@gmail.com' } });

  // Checking if user is in DB
  expect(user).not.toBeNull();

  // Checking if password is hashed
  expect(user.password).not.toBe('test1234');

  // Checking if req contains correct info
  expect(res.body.data.user).toMatchObject({
    username: 'testing',
    email: 'testing@gmail.com',
  });
});

test('Should NOT be able to signup a new user if username is invalid', async () => {
  await request(app)
    .post('/api/v1/users/signup/')
    .send({
      username: 'wrong',
      email: 'wrongtest@gmail.com',
      password: 'test1234',
      confirmPassword: 'test1234',
    })
    .expect(400);

  const user = await User.findOne({ where: { email: 'wrongtest@gmail.com' } });
  expect(user).toBeNull();
});

test('Should NOT be able to signup a new user if email is invalid', async () => {
  await request(app)
    .post('/api/v1/users/signup/')
    .send({
      username: 'wrongtest',
      email: 'wrongtest',
      password: 'test1234',
      confirmPassword: 'test1234',
    })
    .expect(400);

  const user = await User.findOne({ where: { email: 'wrongtest' } });
  expect(user).toBeNull();
});

test('Should NOT be able to signup a new user if password is invalid', async () => {
  await request(app)
    .post('/api/v1/users/signup/')
    .send({
      username: 'wrongtest',
      email: 'wrongtest@gmail.com',
      password: 'test',
      confirmPassword: 'test',
    })
    .expect(400);

  const user = await User.findOne({ where: { email: 'wrongtest@gmail.com' } });
  expect(user).toBeNull();
});

test('Should NOT be able to signup a new user if passwords does not match', async () => {
  await request(app)
    .post('/api/v1/users/signup/')
    .send({
      username: 'wrongtest',
      email: 'wrongtest@gmail.com',
      password: 'test1234',
      confirmPassword: 'test12345',
    })
    .expect(400);

  const user = await User.findOne({ where: { email: 'wrongtest@gmail.com' } });
  expect(user).toBeNull();
});

test('Should be able to login with correct credentials and token should be valid', async () => {
  const res = await request(app)
    .post('/api/v1/users/login/')
    .send({ email: 'pika@example.com', password: 'password' })
    .expect(200);

  let token2 = res.body.token;

  const decoded = await promisify(jwt.verify)(token2, process.env.JWT_SECRET);
  expect(decoded.id).toEqual(res.body.data.user.id);
});

test('Should NOT be able to login with wrong credentials', async () => {
  await request(app)
    .post('/api/v1/users/login/')
    .send({ email: 'pika@example.com', password: 'wrongPass12345' })
    .expect(401);
});
