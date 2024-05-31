const express = require('express');
const router = express.Router();
const db = require('../../database/database.js');

router.get('/user-data/:id', (req, res) => {
    db.query(
        `SELECT lastname, firstname FROM patients WHERE uuid_patient = ?`, req.params.id,
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
  
module.exports = router;