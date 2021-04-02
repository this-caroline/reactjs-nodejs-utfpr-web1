const sequelize = require('../models').sequelize;
const Address = require('../models').Address;
const Patient = require('../models').Patient;
const User = require('../models').User;

module.exports = {
  async store (request, response) {
    const t = await sequelize.transaction();
    const {
      name,
      UserId,
      email,
      birthdate,
      cpf,
      gender,
      phoneNumber,
      motherName,
      postal_code,
      street,
      number,
      complement,
      state,
      neighborhood,
    } = request.body;

    try {
      const address = await Address.create({
        postal_code,
        street,
        number,
        complement,
        state,
        country: 'Brazil',
        neighborhood,
      });
      const patient = await Patient.create({
        name,
        UserId,
        email,
        birthdate,
        cpf,
        gender,
        phoneNumber,
        motherName,
        AddressId: address.id,
      });

      if (!patient || !address) throw new Error();

      await t.commit();
      return response.status(200).json({
        success: true,
        message: 'The patient was successfully created!',
        patient: {
          ...patient.dataValues,
          address: { ...address.dataValues },
        },
      });
    } catch (error) {
      console.log(error);

      await t.rollback();
      return response.status(error.status || 500).json({
        success: false,
        message: error.message ||
          'Internal error. Please try again later or contact us.'
      });
    }
  },

  async update (request, response) {
    const { id } = request.params;
    const {
      name,
      UserId,
      email,
      birthdate,
      cpf,
      gender,
      phoneNumber,
      motherName,
      AddressId,
    } = request.body;

    try {
      const patient = await Patient.findByPk(id, {
        include: { model: User, required: true, attributes: ['username'] },
      });

      if (!patient) throw new Error();

      patient.name = name;
      patient.email = email;
      patient.UserId = UserId;
      patient.birthdate = birthdate;
      patient.cpf = cpf;
      patient.gender = gender;
      patient.phoneNumber = phoneNumber;
      patient.motherName = motherName;
      patient.AddressId = AddressId;

      await patient.save();

      return response.status(200).json({
        success: true,
        message: 'The patient was successfully updated!',
        patient: patient.dataValues,
      });
    } catch (error) {
      return response.status(error.status || 500).json({
        success: false,
        message: error.message ||
          'Internal error. Please try again later or contact us.'
      });
    }
  },

  async index (request, response) {
    try {
      const patients = await Patient.findAll({
        include: { model: User, required: true, attributes: ['username'] },
      });

      return response.status(200).json({
        success: true,
        patients: patients || [],
      });
    } catch (error) {
      return response.status(error.status || 500).json({
        success: false,
        message: error.message ||
          'Internal error. Please try again later or contact us.'
      });
    }
  },

  async destroy (request, response) {
    try {
      const { id } = request.params;

      const patient = await Patient.findByPk(id);

      if (!patient) throw new Error();

      await patient.destroy();
      return response.status(200).json({
        success: true,
        data: id,
      });
    } catch (error) {
      return response.status(error.status || 500).json({
        success: false,
        message: error.message ||
          'Internal error. Please try again later or contact us.'
      });
    }
  }
};
