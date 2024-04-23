const express = require('express');
const router = express.Router();
const db = require('../../database/database.js');
require('dotenv').config();
const authenticateToken = require('../authenticateToken.js');

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

router.get('/patient-info/:id', authenticateToken, (req, res) => {
    db.query(
        'SELECT *, DATE_FORMAT(birthdate, "%d/%m/%Y") as birthdate FROM patients WHERE uuid_patient = ?', req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result)
                {
                    res.status(200).send(result[0]);
                }
            }
        }
    );
});

router.post('/add-allergy', authenticateToken, (req, res) => {
    db.query(
        'INSERT INTO allergies (uuid_patient, type, created_on) VALUES (?, ?, NOW())', [req.body.uuid_patient, req.body.type],
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.affectedRows)
                {
                    res.status(200).send();
                }
            }
        }
    );
});

router.get('/patient-allergies/:id', authenticateToken, (req, res) => {
    db.query(
        'SELECT id_allergy, type FROM allergies WHERE uuid_patient = ? AND (deleted_on IS NULL)', req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result)
                {
                    res.status(200).send(result);
                }
            }
        }
    );
});

router.put('/update-allergy/:id', authenticateToken, (req, res) => {
    db.query(
        'UPDATE allergies SET deleted_on = NOW() WHERE id_allergy = ?', req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.affectedRows)
                {
                    res.status(200).send();
                }
            }
        }
    );
});

router.put('/update-info', authenticateToken, (req, res) => {
    const updatePatientInfo = () => {
        const birthInfo = getBirthInfo(req.body.updated_CNP);
        db.query(
            'UPDATE patients set lastname = ?, firstname = ?, CNP = ?, birthdate = ?, age = ?, gender = ?, weight = ?, height = ?, address = ?, ' + 
                'country = ?, phone = ?, edited_on = NOW() WHERE uuid_patient = ?', 
            [req.body.lastname, req.body.firstname, req.body.updated_CNP, birthInfo[0], birthInfo[1], birthInfo[2], 
                req.body.weight, req.body.height, req.body.address, req.body.country, req.body.phone, req.body.uuid_patient],
            (error, result) => {
                if(error)
                {
                    res.status(500).send();
                }
                else
                {
                    if(result.affectedRows)
                    {
                        res.status(200).send('Datele au fost actualizate cu succes');
                    }
                }
            }
        );
    }

    if(req.body.initial_CNP != req.body.updated_CNP)
    {
        db.query(
            'SELECT * FROM patients WHERE CNP = ? and uuid_doctor = ?', [req.body.updated_CNP, req.body.uuid_doctor],
            (error, result) => {
                if(error)
                {
                    res.status(500).send();
                }
                else
                {
                    if(result.length)
                    {
                        res.status(409).send('Există deja un alt pacient înregistrat cu acest CNP');
                    }
                    else
                    {
                        updatePatientInfo();
                    }
                }
            }
        );
    }
    else
    {
        updatePatientInfo();
    }
});

module.exports = router;