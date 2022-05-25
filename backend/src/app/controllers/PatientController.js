const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { Op } = require("sequelize");

const sequelize = require('../models').sequelize;
const Address = require('../models').Address;
const Appointment = require('../models').Appointment;
const Insurance = require('../models').Insurance;
const Patient = require('../models').Patient;
const User = require('../models').User;

dayjs.extend(utc);

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
      city,
      neighborhood,
    } = request.body;

    const checkCpf = await Patient.findOne({ where: { cpf } });
    
    if (checkCpf) return response.status(422).json({
      success: false,
      status: 422,
      message: 'O seguinte cpf já existe '+cpf
    });;

    try {
      const patient = await Patient.create({
        name,
        UserId: 1,
        email,
        birthdate: dayjs.utc(birthdate).format('YYYY-MM-DD'),
        cpf,
        gender,
        phoneNumber,
        motherName,
      });

      const address = await Address.create({
        postal_code,
        street,
        number,
        complement,
        state,
        city,
        country: 'Brazil',
        neighborhood,
        PatientId: patient.id,
      });

      if (!patient || !address) throw new Error();

      await t.commit();

      return response.status(200).json({
        success: true,
        message: 'The patient was successfully created!',
        patient: {
          ...patient.dataValues,
          Address: { ...address.dataValues },
        },
      });
    } catch (error) {
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
      postal_code,
      street,
      number,
      complement,
      state,
      city,
      neighborhood,
    } = request.body;

    try {
      const patient = await Patient.findByPk(id, {
        include: { model: User, required: true, attributes: ['username'] },
      });
      const address = await Address.findByPk(AddressId);

      if (!patient) throw new Error();

      patient.name = name;
      patient.email = email;
      patient.UserId = UserId;
      patient.birthdate = dayjs.utc(birthdate).format('YYYY-MM-DD');
      patient.cpf = cpf;
      patient.gender = gender;
      patient.phoneNumber = phoneNumber;
      patient.motherName = motherName;
      patient.AddressId = AddressId;
      address.postal_code = postal_code;
      address.street = street;
      address.number = number;
      address.complement = complement;
      address.state = state;
      address.city = city;
      address.neighborhood = neighborhood;

      await patient.save();
      await address.save();

      return response.status(200).json({
        success: true,
        message: 'The patient was successfully updated!',
        // patient: patient.dataValues,
        patient: {
          ...patient.dataValues,
          Address: { ...address.dataValues },
        },
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
        include: [
          { model: Address },
          {
            model: Appointment,
            include: [{
              model: Insurance, required: false, attributes: ['name', 'id'],
            }]
          },
          { model: User, required: true, attributes: ['username'] },
        ],
        where: request.query.name
          ? { name: { [Op.like]: `${request.query.name}%` } }
          : {}
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
    const t = await sequelize.transaction();

    try {
      const { id } = request.params;
      const address = await Address.findOne({ where: { PatientId: id } });
      const patient = await Patient.findByPk(id);

      if (!patient || !address) throw new Error();

      await address.destroy();
      await patient.destroy();
      await t.commit();

      return response.status(200).json({
        success: true,
        data: { patientId: patient.id, addressId: address.id },
      });
    } catch (error) {
      await t.rollback();

      return response.status(error.status || 500).json({
        success: false,
        message: error.message ||
          'Internal error. Please try again later or contact us.'
      });
    }
  }
};
