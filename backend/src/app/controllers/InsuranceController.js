const Insurance = require('../models').Insurance;
const User = require('../models').User;

module.exports = {
  async store (request, response) {
    const { name, UserId } = request.body;

    try {
      const insurance = await Insurance.create({ name, UserId });

      if (!insurance) throw new Error();

      return response.status(200).json({
        success: true,
        message: 'The insurance was successfully created!',
        insurance: insurance.dataValues,
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
    const { name, UserId } = request.body;

    try {
      const insurance = await Insurance.findByPk(id, {
        include: { model: User, required: true, attributes: ['username'] },
      });

      if (!insurance) throw new Error();

      insurance.name = name;
      insurance.UserId = UserId;

      await insurance.save();

      return response.status(200).json({
        success: true,
        message: 'The insurance was successfully updated!',
        insurance: insurance.dataValues,
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
      const insurances = await Insurance.findAll({
        include: { model: User, required: true, attributes: ['username'] },
      });

      return response.status(200).json({
        success: true,
        insurances: insurances || [],
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

      const insurance = await Insurance.findByPk(id);

      if (!insurance) throw new Error();

      await insurance.destroy();
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
