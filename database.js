const { Sequelize } = require('sequelize');

const sequelize =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production'
    ? new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        dialect: 'sqlite',
        host: './dev.sqlite',
        logging: false,
      })
    : new Sequelize(process.env.DB_TEST_NAME, process.env.DB_TEST_USER, process.env.DB_TEST_PASS, {
        dialect: 'sqlite',
        host: './test.sqlite',
        logging: false,
      });

module.exports = sequelize;
