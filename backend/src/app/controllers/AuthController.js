const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = {
  store(request, response) {
    try {
      const { token } = request.body;

      if (!token) throw new Error();

      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      return response.status(200).send({
        success: true,
        message: 'User is authorized.',
        decoded,
      });
    } catch (error) {
      return response.status(error.status || 401).send({
        success: false,
        message: 'Not authorized.',
      });
    }
  },
};
