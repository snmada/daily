const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const signupRoute = require('./signup/signup.js');
app.use('/signup', signupRoute);

const signinRoute = require('./signin/signin.js');
app.use('/signin', signinRoute);

const homeRoute = require('./home/home.js');
app.use('/home', homeRoute);

const resetPasswordRoute = require('./reset-password/reset-password.js');
app.use('/reset-password', resetPasswordRoute);

module.exports = app;