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
            'SELECT COUNT(*) AS count FROM patient_accounts WHERE access_code = ?', accessCode, 
            (error, result) => {
                if(error)
                {
                    //res.status(500).send();
                    console.log(error);
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
                    subject: 'Codul dvs. de acces pentru înregistrarea în aplicația mobilă - DAILY',
                    html: `
                        <p style='font-size:16px'>Stimate utilizator,</h2>
                        <p style='font-size:16px'>Pentru a finaliza procesul de înregistrare, vă rugăm să folosiți codul de mai jos:</p>
                        <p style='font-size:19px'><strong>Cod: ${accessCode}</strong></p>
                        <p style='font-size:16px'>Vă rugăm să parcurgeți următorii pași:</p>
                        <span style='font-size:16px'>1. Deschideți aplicația pe dispozitivul dvs.</span><br>
                        <span style='font-size:16px'>2. Selectați opțiunea de înregistrare.</span><br>
                        <span style='font-size:16px'>3. Introduceți codul de mai sus în câmpul "Cod pacient".</span><br>
                        <span style='font-size:16px'>4. Continuați prin completarea informațiilor necesare pentru a finaliza înregistrarea.</span><br><br>
                        <span style='font-size:16px; margin-top:50px'>Cu respect,</span><br>
                        <span style='font-size:16px'>Echipa DAILY</span>
                    `
                }).then(() => {
                    db.query(
                        'INSERT INTO patient_accounts (uuid_patient, email, access_code, created_on, status) VALUES (?, ?, ?, NOW(), "Pending")', 
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