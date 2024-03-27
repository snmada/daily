const express = require('express');
const router = express.Router();
const db = require('../database/database.js');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
require('dotenv').config();

router.post('/user-sign-in', (req, res) => {
    db.query(
        'SELECT uuid_doctor, password FROM doctor_accounts WHERE email = ?', req.body.email,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.length)
                {
                    bcrypt.compare(req.body.password, result[0].password, (error, response) => {
                        if(error)
                        {
                            res.status(500).send();
                        }
                        else
                        {
                            if(response)
                            {
                                const uuid_doctor = result[0].uuid_doctor;
                                db.query(
                                    'SELECT lastname, firstname FROM doctors WHERE uuid_doctor = ?', uuid_doctor,
                                    (error, result) => {
                                        if(error)
                                        {
                                            res.status(500).send();
                                        }
                                        else
                                        {
                                            const accessToken = jwt.sign(
                                                {
                                                    uuid_doctor: uuid_doctor,
                                                    lastname: result[0].lastname,
                                                    firstname: result[0].firstname
                                                },
                                                process.env.SECRET_JWT,
                                                {expiresIn: '4h'}
                                            );
                                            res.status(200).json({accessToken}).send();
                                        }
                                    }
                                );
                            }
                            else
                            {
                                res.status(422).send('Ați introdus date incorecte');
                            } 
                        }
                    });
                }
                else
                {
                    res.status(404).send('Utilizator inexistent');
                }
            }
        }
    );
});

module.exports = router;