const express = require('express');
const router = express.Router();
const db = require('../../database/database.js');
const bcrypt = require('bcrypt');
require('dotenv').config();

const generateResetCode = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let resetCode = '';
    for (let i = 0; i < 6; i++)
    {
        resetCode += characters[Math.floor(Math.random() * characters.length)];
    }
    return resetCode;
}

const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

router.post('/generate-reset-code', (req, res) => {
    db.query(
        'SELECT * FROM patient_accounts WHERE email = ? AND status = "Activated"', req.body.email,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.length)
                {
                    let resetCode, resetCode_exist = 0;
                    do{
                        resetCode = generateResetCode();
                        db.query(
                            'SELECT COUNT(*) AS count FROM reset_password_requests WHERE reset_code = ?', resetCode, 
                            (error, result) => {
                                if(error)
                                {
                                    res.status(500).send();
                                }
                                else
                                {
                                    result[0].count?  resetCode_exist = 1 : resetCode_exist = 0;
                                }
                            }
                        );
                    }while(resetCode_exist !== 0);

                    const now = new Date(); 
                    const expirationTime = new Date(now.getTime() + (5 * 60 * 1000)); 

                    const generatedAt = formatDateTime(now);
                    const expiresAt = formatDateTime(expirationTime);

                    db.query(
                        `INSERT INTO reset_password_requests (email, reset_code, generated_at, expires_at)
                        VALUES (?, ?, ?, ?)`, [req.body.email, resetCode, generatedAt, expiresAt],
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
                    )
                }
            }
        }
    );
});

router.post('/validate-reset-code', (req, res) => {
    db.query(
        'SELECT * FROM reset_password_requests WHERE email = ? and reset_code = ?', 
        [req.body.email, req.body.reset_code],        
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.length)
                {
                    const now = new Date(); 
                    const currentTime = formatDateTime(now);
                    const expiresAt = formatDateTime(result[0].expires_at);

                    if(currentTime < expiresAt || currentTime === expiresAt) 
                    {
                        res.status(200).send();
                    } 
                    else 
                    {
                        res.status(400).send('Timpul de resetare a parolei a expirat');
                    }
                }
                else
                {
                    res.status(400).send('Cod incorect');
                }
            }
        }
    );
});

router.put('/reset-password', (req, res) => {
    bcrypt.hash(req.body.password, 10, (error, hash) => {
        if(error)
        {
            res.status(500).send();
        }
        else 
        {
            db.query(
                'UPDATE patient_accounts SET password = ? WHERE email = ?',
                [hash, req.body.email],
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
        }
    });
});

module.exports = router;