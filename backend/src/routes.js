const express = require('express');
const Router = express.Router();

const AuthController = require('./app/controllers/AuthController');
const SessionController = require('./app/controllers/SessionController');
const InsuranceController = require('./app/controllers/InsuranceController');

// AUTH
Router.post('/auth/validate', AuthController.store);

// SESSION
Router.post('/session', SessionController.store);

// INSURANCES
Router.post('/insurance', InsuranceController.store);
Router.put('/insurance/:id', InsuranceController.update);
Router.get('/insurance', InsuranceController.index);
Router.delete('/insurance/:id', InsuranceController.destroy);

module.exports = Router;
