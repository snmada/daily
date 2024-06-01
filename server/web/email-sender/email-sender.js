const express = require('express');
const router = express.Router();
const db = require('../../database/database.js');
require('dotenv').config();
const authenticateToken = require('../authenticateToken.js');
const createTransporter = require('../../createTransporter.js');

const generateAccessCode = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let accessCode = '', accessCode_exist = 0;
    for (let i = 0; i < 6; i++)
    {
        accessCode += characters[Math.floor(Math.random() * characters.length)];
    }

    do{
        db.query(
            'SELECT COUNT(*) AS count FROM patient_accounts WHERE accessCode = ?', accessCode, 
            (error, result) => {
                if(error)
                {
                    res.status(500).send();
                }
                else
                {
                    result[0].count?  accessCode_exist = 1 : accessCode_exist = 0;
                }
            }
        );
    }while(accessCode_exist !== 0);

    return accessCode;
}

const sendEmail = async (emailOptions) => {
    let transporter = await createTransporter();
    await transporter.sendMail(emailOptions);
}

router.post('/send', authenticateToken, (req, res) => {
    const accessCode = generateAccessCode();
    db.query(
        'SELECT * FROM patient_accounts WHERE uuid_patient = ?', req.body.uuid_patient, 
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.length)
                {
                    db.query(
                        'UPDATE patient_accounts SET status = "Canceled" WHERE status = "Pending" AND uuid_patient = ?', req.body.uuid_patient,
                        (error, result) => {
                            if(error)
                            {
                                res.status(500).send();
                            }
                        }
                    );
                }
                sendEmail({
                    from: process.env.USER_EMAIL,
                    to: process.env.USER_EMAIL, //req.body.email,
                    subject: 'Cod de acces - DAILY',
                    html: `
                        <h2>Salut!</h2>
                        <p style='font-size:16px'>Cod de Acces: ${accessCode}</p>
                    `
                }).then(() => {
                    db.query(
                        'INSERT INTO patient_accounts (uuid_patient, email, accessCode, created_on, status) VALUES (?, ?, ?, NOW(), "Pending")', 
                        [req.body.uuid_patient, req.body.email, accessCode],
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
                }).catch((error) => {
                    res.status(500).send();
                    console.log(error);
                })
            }
        }
    );
});

router.get('/get-account-info/:id', authenticateToken, (req, res) => {
    db.query(
        'SELECT *, DATE_FORMAT(created_on, "%d/%m/%Y") as created_on FROM patient_accounts WHERE uuid_patient = ?', req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.length > 0 && result.length <= 3)
                {
                    const record = result.filter(record => (record.status === 'Pending' || record.status === 'Activated'));
                    res.status(200).send({
                        email: record[0].email,
                        created_on: record[0].created_on,
                        status: record[0].status,
                        id: record[0].id,
                        try_number: 3 - result.length
                    });
                }
                else if(result.length === 0)
                {
                    res.status(200).send({status: 'N/A'});
                }
            }
        }
    );
});

module.exports = router;