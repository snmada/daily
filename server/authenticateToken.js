const jwt  = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) 
{
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if(!token)
    {
        res.status(401).json({message: 'Unauthorized'});
    }
    else
    {
        jwt.verify(token, process.env.SECRET_JWT, (error, decoded) => {
            if(error)
            {
                res.status(403).json({message: 'Invalid token'});
            }
            else
            {
                req.user =  decoded;
                next();
            }
        });
    }
}

module.exports = authenticateToken;