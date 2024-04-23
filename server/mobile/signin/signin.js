const express = require('express');
const router = express.Router();
const db = require('../../database/database.js');
const bcrypt = require('bcrypt');

router.post('/user-sign-in', (req, res) => {
    db.query(
        'SELECT uuid_patient, password FROM patient_accounts WHERE username = ?', req.body.username,
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
                            response? res.status(200).send(result[0].uuid_patient) : res.status(422).send('Ați introdus date incorecte');
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