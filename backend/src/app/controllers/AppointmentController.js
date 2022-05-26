const { Op } = require("sequelize");

const sequelize = require('../models').sequelize;
const Insurance = require('../models').Insurance;
const Patient = require('../models').Patient;
const Appointment = require('../models').Appointment;

module.exports = {
  async store (request, response) {
    const { datetime, isConfirmed, InsuranceId, PatientId } = request.body;

    try {
      const appointments = await Appointment.findAll({
        where: { datetime }
      });

      if (appointments && appointments.length) {
        return response.status(400).json({
          success: false,
          message: 'This time is not available.',
          field: 'time',
        });
      }

      const appointment = await Appointment.create({
        datetime,
        isConfirmed,
        InsuranceId: InsuranceId || null,
        PatientId,
      });

      if (!appointment) throw new Error();

      return response.status(200).json({
        success: true,
        message: 'The appointment was successfully created!',
        appointment: appointment.dataValues,
      });
    } catch (error) {
      return response.status(error.status || 500).json({
        success: false,
        message: error.message ||
          'Internal error. Please try again later or contact us.'
      });
    }
  },

  async update (request, response) {
    const { id } = request.params;
    const { datetime, isConfirmed, InsuranceId = null, PatientId } = request.body;

    try {
      const appointments = await Appointment.findAll({
        where: { datetime, id: { [Op.not]: id } }
      });

      if (appointments && appointments.length) {
        return response.status(400).json({
          success: false,
          message: 'This time is not available.',
          field: 'time',
        });
      }

      const appointment = await Appointment.findByPk(id);

      if (!appointment) throw new Error();

      appointment.datetime = datetime;
      appointment.isConfirmed = isConfirmed;
      appointment.InsuranceId = InsuranceId;
      appointment.PatientId = PatientId;

      await appointment.save();

      return response.status(200).json({
        success: true,
        message: 'The appointment was successfully updated!',
        appointment: appointment.dataValues,
      });
    } catch (error) {
      return response.status(error.status || 500).json({
        success: false,
        message: error.message ||
          'Internal error. Please try again later or contact us.'
      });
    }
  },

  async show (request, response) {
    const { id } = request.params;

    try {
      const appointments = await Appointment.findOne({
        where: {
          [Op.and]: [{id}, {isConfirmed: 1}]
        }
      });

      return response.status(200).json({
        success: true,
        appointments: appointments || [],
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
      const appointments = request.query.date
        ? await Appointment.findAll({
            include: [
              { model: Insurance, required: false },
              { model: Patient, required: true },
            ],
            where: {
              [Op.and]: [
                sequelize.literal(`DATE(datetime) = '${request.query.date}'`)
              ]
            },
          })
        : await Appointment.findAll({
            include: [
              { model: Insurance, required: false },
              { model: Patient, required: true },
            ],
          });

      return response.status(200).json({
        success: true,
        appointments: appointments || [],
      });
    } catch (error) {
      console.log(error);

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
      const appointment = await Appointment.findByPk(id);

      if (!appointment) throw new Error();

      await appointment.destroy();

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
