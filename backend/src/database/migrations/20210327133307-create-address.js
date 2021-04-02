'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      postal_code: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      street: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      number: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      complement: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      neighborhood: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      PatientId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Patients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Addresses');
  },
};