'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.addColumn('insurances', 'phone', {
              type: Sequelize.STRING
          }, { transaction: t }),
      ])
  })
  },

  async down (queryInterface, Sequelize) {
  }
};
