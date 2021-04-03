const express = require('express');
const Router = express.Router();

const AuthController = require('./app/controllers/AuthController');
const AppointmentController = require('./app/controllers/AppointmentController');
const SessionController = require('./app/controllers/SessionController');
const InsuranceController = require('./app/controllers/InsuranceController');
const PatientController = require('./app/controllers//PatientController');

// AUTH
Router.post('/auth/validate', AuthController.store);

// SESSION
Router.post('/session', SessionController.store);

// APPOINTMENTS
Router.post('/appointment', AppointmentController.store);
Router.put('/appointment/:id', AppointmentController.update);
Router.get('/appointment', AppointmentController.index);
Router.delete('/appointment/:id', AppointmentController.destroy);

// INSURANCES
Router.post('/insurance', InsuranceController.store);
Router.put('/insurance/:id', InsuranceController.update);
Router.get('/insurance', InsuranceController.index);
Router.delete('/insurance/:id', InsuranceController.destroy);

// PATIENTS
Router.post('/patient', PatientController.store);
Router.put('/patient/:id', PatientController.update);
Router.get('/patient', PatientController.index);
Router.delete('/patient/:id', PatientController.destroy);

module.exports = Router;
