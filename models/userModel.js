const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class User extends Model {}
User.init(
  {
    username: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    confirmPassword: { type: DataTypes.STRING },
  },
  { sequelize, modelName: 'user' }
);

// (async () => {
//   await sequelize.sync();
//   const jane = await User.create({
//     username: 'janedoe',
//     birthday: new Date(1980, 6, 20),
//   });
//   console.log(jane.toJSON());
// })();

module.exports = User;
