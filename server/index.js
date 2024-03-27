const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const signupRoute = require('./signup/signup.js');
app.use('/signup', signupRoute);

app.listen(3001, (error) => {
    if(error)
    {
        console.error('Unable to start the web server -> ', error);
    }
    else
    {
        console.log('\x1b[32m%s\x1b[0m', 'Server running...');
    }
});