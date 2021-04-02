'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Patient.hasOne(models.Address);
      Patient.hasMany(models.Appointment);
      Patient.belongsTo(models.User);
    }
  };
  Patient.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM(['Female', 'Male', 'Other']),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    motherName: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    UserId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};
