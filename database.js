const mysql = require('mysql2');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})


/*
// Check if we are in test mode
const dbName = process.env.NODE_ENV === 'test' ? 'usersdb_test' : 'usersdb';
*/
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
// Connect to DB
db.connect(function(err){
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  }else {
     console.log(`Connected to MySQL database: ${process.env.DB_NAME}`);
  }
 
});

module.exports = db;