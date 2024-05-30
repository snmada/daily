const express = require('express');
const router = express.Router();
const db = require('../../database/database.js');
require('dotenv').config();
const authenticateToken = require('../authenticateToken.js');

router.get('/data/:id', authenticateToken, (req, res) => {
    db.query(
        `SELECT p.uuid_patient, p.age, p.gender, psd.acne_type FROM patients p 
        LEFT JOIN patient_skin_data psd ON p.uuid_patient = psd.uuid_patient 
        WHERE p.uuid_doctor = ?`, req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.length)
                {
                    const totalPatients = result.length;
                    let sum = 0, totalFemale = 0, totalMale = 0;
                    result.forEach(patient => {
                        sum += patient.age;
                        patient.gender === 'F'? totalFemale++ : totalMale++;
                    });
                    const averageAge = Math.round(sum/totalPatients);

                    const counts = {
                        F: {rosacea: 0, vulgaris: 0, juvenile: 0, cystic: 0},
                        M: {rosacea: 0, vulgaris: 0, juvenile: 0, cystic: 0}
                    };
                    
                    result.forEach(patient => {
                        const {gender, acne_type} = patient;
                        if(gender === 'F') 
                        {
                            counts.F[acne_type]++;
                        } 
                        else if(gender === 'M') 
                        {
                            counts.M[acne_type]++;
                        }
                    });
                    
                    res.status(200).send({
                        totalPatients, averageAge, totalFemale, totalMale, 
                        'totalFRosacea': counts.F.rosacea,
                        'totalFVulgaris': counts.F.vulgaris,
                        'totalFJuvenile': counts.F.juvenile,
                        'totalFCystic': counts.F.cystic,

                        'totalMRosacea': counts.M.rosacea,
                        'totalMVulgaris': counts.M.vulgaris,
                        'totalMJuvenile': counts.M.juvenile,
                        'totalMCystic': counts.M.cystic,

                        'totalRosacea': counts.F.rosacea + counts.M.rosacea,
                        'totalVulgaris': counts.F.vulgaris + counts.M.vulgaris,
                        'totalJuvenile': counts.F.juvenile + counts.M.juvenile,
                        'totalCystic': counts.F.cystic + counts.M.cystic
                    });
                }
            }
        }
    );
});

router.get('/medical-records/:id', authenticateToken, (req, res) => {
    db.query(
        `SELECT p.uuid_patient, p.lastname, p.firstname, mr.id_medical_record, 
        DATE_FORMAT(mr.created_on, "%d/%m/%Y") as created_on FROM patients p
        LEFT JOIN medical_records mr ON p.uuid_patient = mr.uuid_patient
        WHERE p.uuid_doctor = ? AND (mr.deleted_on IS NULL) AND p.uuid_patient = mr.uuid_patient`, req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                res.status(200).send(result);
            }
        }
    );
});

module.exports = router;