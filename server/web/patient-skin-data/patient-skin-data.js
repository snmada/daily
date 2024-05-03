const express = require('express');
const router = express.Router();
const db = require('../../database/database.js');
require('dotenv').config();
const authenticateToken = require('../authenticateToken.js');

router.get('/patient-name/:id', authenticateToken, (req, res) => {
    db.query(
        'SELECT firstname, lastname FROM patients WHERE uuid_patient = ?', req.params.id,
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

router.get('/data/:id', authenticateToken, (req, res) => {
    db.query(
        'SELECT * FROM patient_skin_data WHERE uuid_patient = ?', req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                result.length? res.status(200).send(result[0]) : res.status(404).send();
            }
        }
    );
});

router.post('/add', authenticateToken, (req, res) => {
    db.query(
        'INSERT INTO patient_skin_data ' + 
        '(uuid_patient, phototype, skin_type, acne_type, acne_description, acne_localization, acne_severity, acne_history, treatment_history, observations)' + 
        ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.body.uuid_patient, req.body.phototype, req.body.skin_type, req.body.acne_type, req.body.acne_description, 
            req.body.acne_localization, req.body.acne_severity, req.body.acne_history, req.body.treatment_history, req.body.observations],
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

router.put('/update', authenticateToken, (req, res) => {
    db.query(
        'UPDATE patient_skin_data ' + 
        'SET phototype = ?, skin_type = ?, acne_type = ?, acne_description = ?, acne_localization = ?, acne_severity = ?, acne_history = ?, treatment_history = ?, observations = ? WHERE uuid_patient = ?',
        [req.body.phototype, req.body.skin_type, req.body.acne_type, req.body.acne_description, req.body.acne_localization, 
            req.body.acne_severity, req.body.acne_history, req.body.treatment_history, req.body.observations, req.body.uuid_patient],
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