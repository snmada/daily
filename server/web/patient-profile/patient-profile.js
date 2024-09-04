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
            gender = 'M';
        break;

        case '2':
        case '6':
            gender = 'F';
        break;
    }

    switch(CNP.substring(0,1))
    {
        case '1':
        case '2':;
            year = parseInt('19' + CNP.substring(1,3));
        break;

        case '5':
        case '6':
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
        `SELECT *, DATE_FORMAT(birthdate, "%d/%m/%Y") as birthdate, 
        CONCAT(DATE_FORMAT(created_on, "%d"), ' ',
        CASE MONTH(created_on)
            WHEN 1 THEN 'Ian.'
            WHEN 2 THEN 'Feb.'
            WHEN 3 THEN 'Mar.'
            WHEN 4 THEN 'Apr.'
            WHEN 5 THEN 'Mai'
            WHEN 6 THEN 'Iun.'
            WHEN 7 THEN 'Iul.'
            WHEN 8 THEN 'Aug.'
            WHEN 9 THEN 'Sep.'
            WHEN 10 THEN 'Oct.'
            WHEN 11 THEN 'Noi.'
            ELSE 'Dec.'
        END, ' ', DATE_FORMAT(created_on, "%Y")) as created_on FROM patients WHERE uuid_patient = ?`, req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result)
                {
                    const birthInfo = getBirthInfo(result[0].CNP);
                    const age = birthInfo[1];

                    db.query(`UPDATE patients SET age = ? WHERE uuid_patient  = ?`, [age, req.params.id],
                        (error) => {
                            if(error)
                            {
                                res.status(500).send();
                            }
                            else
                            {
                                result[0].age = birthInfo[1];
                                res.status(200).send(result[0]);
                            }
                        }
                    );
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

router.put('/delete-allergy/:id', authenticateToken, (req, res) => {
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
                'country = ?, phone = ? WHERE uuid_patient = ?', 
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

router.get('/acne-type/:id', authenticateToken, (req, res) => {
    db.query(
        'SELECT acne_type FROM patient_skin_data WHERE uuid_patient = ?', req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                result.length && res.status(200).send(result[0]);
            }
        }
    );
});

router.get('/treatment-plan/:id', authenticateToken, (req, res) => {
    db.query(
        'SELECT uuid_treatment_plan, recommendation, morning, noon, evening, observations FROM treatment_plans WHERE uuid_patient = ? AND (deleted_on IS NULL)', req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.length)
                {
                    const data = result.map((item, index) => ({...item, index: index + 1}));
                    res.status(200).send(data);
                }
            }
        }
    );
});


router.post('/add-treatment-plan', authenticateToken, (req, res) => {
    const tableData = req.body.table; 
    const values = tableData.map(row => [
        req.body.uuid_patient, 
        row.uuid_treatment_plan, 
        row.recommendation,
        row.morning,
        row.noon,
        row.evening,
        row.observations,
        new Date(), 
        null
    ]);

    db.query(
        'INSERT INTO treatment_plans (uuid_patient, uuid_treatment_plan, recommendation, morning, noon, evening, observations, date, deleted_on) VALUES ?', 
        [values],
        (error, result) => {
            if(error) 
            {
                
                res.status(500).send();
            } 
            else 
            {
                result.affectedRows && res.status(200).send();
            }
        }
    );
});

router.put('/delete-treatment-plan/:id', authenticateToken, (req, res) => {
    db.query(
        'UPDATE treatment_plans SET deleted_on = NOW() WHERE uuid_treatment_plan = ?', req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                result.affectedRows && res.status(200).send();
            }
        }
    );
});

router.get('/medical-condition/:id', authenticateToken, (req, res) => {
    db.query(
        'SELECT * FROM medical_conditions WHERE uuid_patient = ? AND (deleted_on IS NULL)', req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                result && res.status(200).send(result);
            }
        }
    );
});

router.put('/update-medical-condition', authenticateToken, (req, res) => {
    db.query(
        'UPDATE medical_conditions SET name = ?, treatment = ? WHERE id_medical_condition = ?', 
        [req.body.name, req.body.treatment, req.body.id],
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                result.affectedRows && res.status(200).send();
            }
        }
    );
});

router.post('/add-medical-condition', authenticateToken, (req, res) => {
    db.query(
        'INSERT INTO medical_conditions (uuid_patient, name, treatment) VALUES (?, ?, ?)', 
        [req.body.uuid_patient, req.body.name, req.body.treatment],
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                result.affectedRows && res.status(200).send();
            }
        }
    );
});

router.put('/delete-medical-condition/:id', authenticateToken, (req, res) => {
    db.query(
        'UPDATE medical_conditions SET deleted_on = NOW() WHERE id_medical_condition = ?', req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                result.affectedRows && res.status(200).send();
            }
        }
    );
});



module.exports = router;