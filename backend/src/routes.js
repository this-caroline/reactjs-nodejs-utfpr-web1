const express = require('express');
const Router = express.Router();

const AuthController = require('./app/controllers/AuthController');
const SessionController = require('./app/controllers/SessionController');

// AUTH
Router.post('/auth/validate', AuthController.store);

// SESSION
Router.post('/session', SessionController.store);

module.exports = Router;
