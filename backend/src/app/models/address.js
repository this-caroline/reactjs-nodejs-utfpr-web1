'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.hasOne(models.Patient);
    }
  };
  Address.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    postal_code: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    neighborhood: {
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
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};
