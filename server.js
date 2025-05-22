const express = require('express');// express setup
const mysql = require('mysql2'); // my sql2 setup
const server = express(); // server setup
const path = require("path"); // Handle file path
const port = 1500; // port created

const methodOverride = require('method-override'); // setup a method for put,patch,delete, overwrite.
server.use(methodOverride('_method')); // server use the method
server.set('view engine', 'ejs'); // view folder as engine that reccognize ejs files in it.
server.set('views', path.join(__dirname, 'views')); // 

server.use(express.static(path.join(__dirname, 'public')))//

// Create connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'usersdb'
});
// Connect to DB
db.connect(function(err){
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL database.');
});

<<<<<<< HEAD

server.get('/users', function(req, res) {
  // Example with MySQL:
  db.query('SELECT * FROM users', function(err, results) {
    if (err) 
        return res.status(500).send("Database error");

    res.render('index', { users: results }); // ⬅️ PASS users to index.ejs
=======
server.get('/users', function(req, res){
  // Example with MySQL:
  db.query('SELECT * FROM users', function(err, results){
    if (err) return res.status(500).send("Database error");
    
    res.render('index', { users:results }); // ⬅️ PASS users to EJS
>>>>>>> 08ceef12435a6817c7503f033c7353087e944047
  });
});


server.get("/users/:id", function (req, resp) {
<<<<<<< HEAD
    const id = req.params.id;
    db.query("SELECT * FROM users WHERE id = ?", [id], function(err, results) {
        if (err) throw err;
        if (results.length > 0) {
            resp.render("user", { user: results[0] });
        } else {
            resp.status(404).send("user not found");
=======
  const id = req.params.id;
  db.query('SELECT * FROM users WHERE id = ?', [id], function (err, results) {
        if (err) {
            console.error('Database error:', err);
            return resp.status(500).send("Server error");
        }

        if (results.length > 0) {
            const user = results[0];
            resp.render("user", { user });
        } else {
            resp.status(404).send("User not found");
>>>>>>> 08ceef12435a6817c7503f033c7353087e944047
        }
    });
});
    

server.get("/create", function (req, resp) {
    resp.render("create");
});

server.get('/users/:id/edit', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send("Database error");

    if (results.length === 0) return res.status(404).send("User not found");

    const user = results[0];
    res.render('edit', { userId, user });
  });
});

// Handle update


server.put('/users/:id', (req, res) => {
  const { Name, Email } = req.body;
  const userId = req.params.id;

  const query = 'UPDATE users SET Name = ?, Nickname = ?,Age=?,  Bio=? WHERE id = ?';
  db.query(query, [Name, Nickname,Age, Bio, userId], (err, result) => {
    if (err) return res.status(500).send("Update error");
    res.redirect(`/users/${userId}`);  
  });
});


server.listen(port, function()  {
  console.log(`The server is listening ${port}`)
})