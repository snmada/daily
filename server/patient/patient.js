const express = require('express');
const router = express.Router();
const db = require('../database/database.js');
const uuid = require('uuid');
require('dotenv').config();
const authenticateToken = require('../authenticateToken.js');

router.post('/add', authenticateToken, (req, res) => {
    db.query(
        'SELECT * FROM patients WHERE CNP = ? AND uuid_doctor = ?', [req.body.CNP, req.body.uuid_doctor],
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.length)
                {
                    res.status(409).send('Pacientul este deja înregistrat.')
                }
                else
                {
                    const uuid_patient = uuid.v4();

                    db.query(
                        'INSERT INTO patients (uuid_patient, uuid_doctor, lastname, firstname, CNP) VALUES (?, ?, ?, ?, ?)',
                        [uuid_patient, req.body.uuid_doctor, req.body.lastname, req.body.firstname, req.body.CNP],
                        (error, result) => {
                            if(error)
                            {
                                res.status(500).send();
                            }
                            else
                            {
                                if(result.affectedRows)
                                {
                                    res.status(200).send({uuid_patient: uuid_patient});
                                }
                            }
                        }
                    );
                }
            }
        }
    );
});

module.exports = router;