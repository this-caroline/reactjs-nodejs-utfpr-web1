'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Patients', [{
      name: 'user',
      email: 'user@email.com',
      birthdate: '2022-03-09 00:00:00',
      cpf: 47932408747,
      gender: 1,
      phoneNumber: 1111111,
      motherName: 'User',
      createdAt: '2022-03-09 00:00:00',
      updatedAt: '2022-03-09 00:00:00',
      UserId: 1
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
