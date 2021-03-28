const User = require('../models').User;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  async store(request, response) {
    const { username, password } = request.body;

    try {
      const user = await User.findOne({ where: { username } });

      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          process.env.SECRET_KEY,
          { expiresIn: 86400000 },
        );

        return response.status(200).send({
          success: true,
          message: 'User successfully authenticated.',
          id: user.id,
          username: user.username,
          token,
        });
      }

      return response.status(401).send({
        success: false,
        message: 'Please check your credentials.'
      });
  } catch (error) {
      return response.status(500).send({
        success: false,
        message: 'Internal Error. Please try again later or contact us.',
      });
    }
  }
};
