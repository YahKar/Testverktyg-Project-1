const mysql = require('mysql2');

// Create connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Chama@0307',
  database: 'usersdb'
});
// Connect to DB
db.connect(function(err){
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  }else {
     console.log('Connected to MySQL database.');
  }
 
});

module.exports = db;