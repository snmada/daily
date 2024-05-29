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
        'SELECT id_medical_record AND DATE_FORMAT(created_on, "%d/%m/%Y") as date FROM medical_records WHERE uuid_patient = ? AND (deleted_on IS NULL)', req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                result.length? res.status(200).send(result) : res.status(404).send();
            }
        }
    );
});

router.post('/add', authenticateToken, (req, res) => {
    db.query(
        `INSERT INTO medical_records  
        (uuid_patient, comedones, papules, pustules, nodules, cysts, affected_areas, observed_changes, 
        adverse_reactions, discomfort_level, quality_life_level, doctor_observations, patient_observations, created_on)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [req.body.uuid_patient, req.body.comedones, req.body.papules, req.body.pustules, req.body.nodules, 
            req.body.cysts, req.body.affected_areas, req.body.observed_changes, req.body.adverse_reactions, 
            req.body.discomfort_level, req.body.quality_life_level, req.body.doctor_observations, req.body.patient_observations],
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