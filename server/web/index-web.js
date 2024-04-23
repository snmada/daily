const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const signupRoute = require('./signup/signup.js');
app.use('/signup', signupRoute);

const signinRoute = require('./signin/signin.js');
app.use('/signin', signinRoute);

const patientRoute = require('./patient/patient.js');
app.use('/patient', patientRoute);

const patientProfileRoute = require('./patient-profile/patient-profile.js');
app.use('/patient-profile', patientProfileRoute);

const emailSenderRoute = require('./email-sender/email-sender.js');
app.use('/email-sender', emailSenderRoute);

module.exports = app;