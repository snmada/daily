const mysql = require('mysql2');
require('dotenv').config();

const db =  mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.connect(function(error){
    if(error)
    {
        console.error('Error connecting to database -> ', error);
    }
    else
    {
        console.log('\x1b[32m%s\x1b[0m', 'Connected to database...');
    }
});

module.exports = db;