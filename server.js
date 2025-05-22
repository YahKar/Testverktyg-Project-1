const express = require('express');
const mysql = require('mysql2');
const server = express();
const path = require("path"); // Handle file path
const port = 1500;

const methodOverride = require('method-override');
server.use(methodOverride('_method'));
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use(express.static(path.join(__dirname, 'public')))

// Create connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
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

server.get('/users', (req, res) => {
  // Example with MySQL:
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send("Database error");
    
    res.render('index', { users: results }); // ⬅️ PASS users to EJS
  });
});


server.get("/users/:id", function (req, resp) {
    const id = req.params.id;
    if(users[id]) {
        resp.render("user", { user: users[id] });
    } else {
        resp.status(404).send("User not found");
    }
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