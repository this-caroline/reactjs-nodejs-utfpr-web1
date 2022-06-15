'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Users', [{
        username: 'admin',
        password: 'admin',
        tokenCreatedAt: '2022-03-09 00:00:00',
        createdAt: '2022-03-09 00:00:00',
        updatedAt: '2022-03-09 00:00:00'
      }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
