const express = require('express');
const router = express.Router();
const db = require('../../database/database.js');
const uuid = require('uuid');
require('dotenv').config();
const authenticateToken = require('../authenticateToken.js');
const jwt = require('jsonwebtoken');

function getBirthInfo(CNP) 
{
    let year, month, day, age, gender, month_difference, full_year;

    switch(CNP.substring(0,1))
    {
        case '1':
        case '5':
        case '7':
            gender = 'M';
            year = parseInt('19' + CNP.substring(1,3));
        break;

        case '2':
        case '6':
        case '8':
            gender = 'F';
            year = parseInt('20' + CNP.substring(1,3));
        break;

    }

    month = CNP.substring(3, 5);
    day = CNP.substring(5, 7);

    month_difference = Date.now() - new Date(month + '/' + day + '/' + year).getTime();
    full_year = new Date(month_difference).getUTCFullYear();

    age = Math.abs(full_year - 1970);

    return [year + '-' + month + '-' + day, age, gender];
}

router.post('/add', authenticateToken, (req, res) => {
    const birthInfo = getBirthInfo(req.body.CNP);

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
                        'INSERT INTO patients (uuid_patient, uuid_doctor, lastname, firstname, CNP, birthdate, age, gender, address, country, phone, created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
                        [uuid_patient, req.body.uuid_doctor, req.body.lastname, req.body.firstname, 
                            req.body.CNP, birthInfo[0], birthInfo[1], birthInfo[2], req.body.address, req.body.country, req.body.phone],
                        (error, result) => {
                            if(error)
                            {
                                res.status(500).send();
                            }
                            else
                            {
                                if(result.affectedRows)
                                {
                                    const token_patient = jwt.sign({firstname: req.body.firstname, lastname: req.body.lastname}, process.env.SECRET_JWT);
                                    res.status(200).send({uuid_patient, token_patient});
                                }
                            }
                        }
                    );
                }
            }
        }
    );
});

router.get('/data/:id', authenticateToken, (req, res) => {
    db.query(
        `SELECT ROW_NUMBER() OVER(ORDER BY uuid_patient) as id, uuid_patient, lastname, firstname, CNP, 
        DATE_FORMAT(birthdate, '%d-%m-%Y') as birthdate, age, phone FROM patients WHERE uuid_doctor = ?`, 
        req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.length)
                {
                    res.status(200).send(result);
                }
            }
        }
    );
});

module.exports = router;