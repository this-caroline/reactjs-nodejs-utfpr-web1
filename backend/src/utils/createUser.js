require('dotenv').config();

const { Sequelize } = require('sequelize');
const User = require('../app/models').User;
const bcrypt = require('bcrypt');

const checkConnection = async (sequelize) => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.log('Error trying to connect to database.');
    return false;
  }
};

module.exports = async () => {
  const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT
    },
  );

  if(!await checkConnection(sequelize)) return false;

  try {
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username: 'pedrorubinger',
      email: 'test@mail.com',
      password: hashedPassword,
    });

    console.log('User was successfully created.');
    return true;
  } catch (error) {
    console.log('An error has occurred. User was not created.', error);
    return false;   
  }
};
