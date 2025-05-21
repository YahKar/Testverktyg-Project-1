const express = require('express');
const mysql = require('mysql2');
const server = express();
const path = require("path"); // Handle file path
const port = 1500;

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

// Example route
server.get('/', function(req, res){
  db.query('SELECT * FROM users', function(err, results){
    if (err) {
      return res.status(500).send('Error fetching data.');
    }
    res.json(results);
  });
});


const users = [
    { Name: "Ratnasri", Nickname: "Ratna", Age: 20, Bio: "Student as a software tester."},
    { Name: "Hifza", Nickname: "Mamma", Age: 21, Bio: "Programmer" },
    { Name: "Chama Hakkal", Nickname: "Chacho", Age: 22, Bio: "Tester" },
    {Name: "Shreelakshmi", Nickname: "Shree", Age: 19, Bio: "Software Engineer"},
]


server.get("/users", function (req, resp) {
    resp.render("index", { user: users });
});


server.get("/users/:id", function (req, resp) {
    const id = req.params.id;
    if(users[id]) {
        resp.render("user", { user: users[id] });
    } else {
        resp.status(404).send("User not found");
    }
});

server.post("/create", function (req, resp) {
    resp.render("create");
});

server.get("/edit/:id", function (req, resp) {
    resp.render("user", { user: users[id] });
});



server.listen(port, function()  {
  console.log(`The server is listening ${port}`)
})