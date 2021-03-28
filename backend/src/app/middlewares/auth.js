const jwt = require('jsonwebtoken');

module.exports = () => (request, response, next) => {
  try {
    const token = request.headers.authorization.split(' ')[1];

    if (!token) {
      return response.status(401).send({
        success: false,
        message: 'No token provided.'
      });
    }

    jwt.verify(token, process.env.SECRET_KEY);

    next();
  } catch (error) {
    response.status(401).send({ success: false, message: 'Not authorized.' });
  }
};
