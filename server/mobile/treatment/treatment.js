const express = require('express');
const router = express.Router();
const db = require('../../database/database.js');

router.get('/treatment-plan/:id', (req, res) => {
    db.query(
        `SELECT uuid_treatment_plan, recommendation, morning, noon, evening, observations 
        FROM treatment_plans WHERE uuid_patient = ? AND (deleted_on IS NULL)`, req.params.id,
        (error, result) => {
            if(error)
            {
                res.status(500).send();
            }
            else
            {
                if(result.length)
                {
                    const data = result.map((item, index) => ({...item, index: index + 1}));
                    res.status(200).send(data);
                }
            }
        }
    );
});

module.exports = router;