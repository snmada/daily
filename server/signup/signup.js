const express = require('express');
const router = express.Router();
const db = require('../database/database.js');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
require('dotenv').config();

router.get('/stepTwo', (req, res) => {
    const {lastname, firstname, CNP, stampCode} = req.query;
    
    db.query(
        'SELECT * FROM doctors WHERE lastname = ? AND firstname = ? AND CNP = ? AND stamp_code = ?', 
        [lastname, firstname, CNP, stampCode],
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.length)
                {
                    db.query(
                        'SELECT * FROM doctor_accounts WHERE uuid_doctor = ?', result[0].uuid_doctor,
                        (error, result) => {
                            if(error)
                            {
                                res.status(500).send();
                            }
                            else
                            {
                                result.length? res.status(409).send('Informațiile furnizate sunt deja asociate cu un alt cont existent.') : res.status(200).send();
                            }
                        }
                    );
                }
                else
                {
                    res.status(404).send('Informațiile furnizate nu există în baza noastră de date.');
                } 
            }
        }
    );
});

router.post('/stepThree', (req, res) => {
    bcrypt.hash(req.body.password, 10, (error, hash) => {
        if(error)
        {
            res.status(500).send();
        }
        else 
        {
            db.query(
                'SELECT * FROM doctor_accounts WHERE email = ?', req.body.email,
                (error, result) => {
                    if(error)
                    {
                        res.status(500).send();
                    }
                    else
                    {
                        if(result.length)
                        {
                            res.status(409).send('Există deja un cont asociat cu această adresă de email.')
                        }
                        else
                        {
                            db.query(
                                'SELECT uuid_doctor FROM doctors WHERE CNP = ?', req.body.CNP,
                                (error, result) => {
                                    if(error)
                                    {
                                        res.status(500).send();
                                    }
                                    else
                                    {
                                        const uuid_doctor = result[0].uuid_doctor;
                                        db.query(
                                            'INSERT INTO doctor_accounts (uuid_doctor, email, password) VALUES (?, ?, ?)',
                                            [uuid_doctor, req.body.email, hash],
                                            (error, result) => {
                                                if(error)
                                                {
                                                    res.status(500).send();
                                                }
                                                else
                                                {
                                                    if(result.affectedRows)
                                                    {
                                                        const accessToken = jwt.sign(
                                                            {
                                                                uuid_doctor: uuid_doctor,
                                                                lastname: req.body.lastname,
                                                                firstname: req.body.firstname
                                                            },
                                                            process.env.SECRET_JWT,
                                                            {expiresIn: '4h'}
                                                        );
                                                        res.status(200).json({accessToken}).send();
                                                    }
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        } 
                    }
                }
            );
        }
    });
});
  
module.exports = router;