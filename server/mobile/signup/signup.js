const express = require('express');
const router = express.Router();
const db = require('../../database/database.js');
const bcrypt = require('bcrypt');

router.post('/user-sign-up', (req, res) => {
    db.query(
        'SELECT uuid_patient, status FROM patient_accounts WHERE access_code = ?', req.body.accessCode, 
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.length)
                {
                    if(result[0].status === 'Pending')
                    {
                        const uuid_patient = result[0].uuid_patient;
                        db.query(
                            'SELECT * FROM patients WHERE uuid_patient = ? AND CNP = ?', [uuid_patient, req.body.CNP],
                            (error, result) => {
                                if(error)
                                {
                                    res.status(500).send();
                                }
                                else
                                {
                                    if(result.length)
                                    {
                                        bcrypt.hash(req.body.password, 10, (error, hash) => {
                                            if(error)
                                            {
                                                res.status(500).send();
                                            }
                                            else 
                                            {
                                                db.query(
                                                    'SELECT * FROM patient_accounts WHERE username = ?', req.body.username,
                                                    (error, result) => {
                                                        if(error)
                                                        {
                                                            res.status(500).send();
                                                        }
                                                        else
                                                        {
                                                            if(result.length)
                                                            {
                                                                res.status(409).send('Numele de utilizator introdus este deja înregistrat în sistem. Vă rugăm să alegeți un alt nume de utilizator');
                                                            }
                                                            else
                                                            {
                                                                db.query(
                                                                    'UPDATE patient_accounts SET username = ?, password = ?, status = ? WHERE uuid_patient = ? AND access_code = ?',
                                                                    [req.body.username, hash, 'Activated', uuid_patient, req.body.accessCode],
                                                                    (error, result) => {
                                                                        if(error)
                                                                        {
                                                                            res.status(500).send();
                                                                        }
                                                                        else
                                                                        {
                                                                            result.affectedRows && res.status(200).send(uuid_patient);
                                                                        }
                                                                    }
                                                                );
                                                            } 
                                                        }
                                                    }
                                                );
                                            }
                                        });
                                    }
                                    else
                                    {
                                        res.status(404).send('Codul de acces nu este asociat cu CNP-ul furnizat');
                                    } 
                                }
                            }
                        );
                    }
                    else if(result[0].status === 'Activated')
                    {
                        res.status(409).send('Există deja un cont creat');
                    }
                    else if(result[0].status === 'Canceled')
                    {
                        res.status(404).send('Cod de acces inexistent');
                    }
                }
                else
                {
                    res.status(404).send('Cod de acces inexistent');
                }
            }
        }
    );
});
  
module.exports = router;