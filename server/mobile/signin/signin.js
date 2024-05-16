const express = require('express');
const router = express.Router();
const db = require('../../database/database.js');
const bcrypt = require('bcrypt');

router.post('/user-sign-in', (req, res) => {
    db.query(
        `SELECT pa.uuid_patient, pa.password, p.uuid_doctor FROM patient_accounts pa 
        JOIN patients p ON pa.uuid_patient = p.uuid_patient WHERE pa.username = ?`, req.body.username,
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
                                res.status(200).send({
                                    uuid_doctor: result[0].uuid_doctor, 
                                    uuid_patient: result[0].uuid_patient
                                });
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