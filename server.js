const express = require('express');// express setup
const methodOverride = require('method-override');// setup a method for put,patch,delete, overwrite.
const path = require("path"); // Handle file path
const db = require('./database');

const server = express(); // server setup

server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method')); // server use the method
server.set('view engine', 'ejs'); // view folder as engine that reccognize ejs files in it.
server.set('views', path.join(__dirname, 'views')); // 
server.use(express.static(path.join(__dirname, 'public')))//


server.get('/users', function(req, res){
  // Example with MySQL:
  db.query('SELECT * FROM users', function(err, results){
    if (err) return res.status(500).send("Database error");
    
    res.render('index', { users:results }); // PASS users to EJS
  });
});


server.get("/users/:id", function (req, resp) {
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
        }
    });
});
    
//create method

server.get("/create", function (req, res) {
  res.render("create");
});
    
/*
server.post("/create", function (req, resp) {
    const user = req.body;

    db.query("INSERT INTO users (Name, Nickname, Age, Bio) VALUES (?, ?, ?, ?)",
        [user.Name, user.Nickname, user.Age, user.Bio],
        function(err) {
            if(err) {
                console.error("MySQL insert err: ", err);
                return resp.send("Wrong!");
        }
        resp.redirect("/users");
});

});
*/

//post method

server.post("/create", function(req, res) {
  console.log('POST Body:', req.body)
  const { Name, Nickname, Age, Bio } = req.body;

  const query = "INSERT INTO users (Name, Nickname, Age, Bio) VALUES (?, ?, ?, ?)";
  db.query(query, [Name, Nickname, Age, Bio], function(err, result) {
    if (err) {
      console.error("Insert error (from test):", err);
      return res.status(500).send("Error saving user");
    }
    res.redirect("/users");
  });
});


//edit method

server.get('/users/:id/edit', function(req, res) {
  const userId = req.params.id;

  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], function(err, results) {
    if (err) return res.status(500).send("Database error");

    if (results.length === 0) return res.status(404).send("User not found");

    const user = results[0];
    res.render('edit', { userId, user });
  });
});

// Handle update


server.put('/users/:id', function(req, res) {
  const userId = req.params.id;
  console.log('PUT Body:', req.body);
  const { Name, Nickname, Age, Bio } = req.body;
  

  const query = 'UPDATE users SET Name = ?, Nickname = ?, Age= ?, Bio= ? WHERE id = ?';
  db.query(query, [Name, Nickname, Age, Bio, userId], function(err, result) {
    if (err) {
      console.error('Update error (from test):', err);
      return res.status(500).send("Update error");
    } 
    res.redirect(`/users/${userId}`); 
  });
});

// Handle delete

server.delete('/users/:id', function(req, res) {
  const userId = req.params.id;
  console.log(`Deleting user with ID: ${req.params.id}`);

  db.query('DELETE FROM users WHERE id = ?', [userId], function(err, result) {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).send("Database error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("User not found");
    }

    res.redirect('/users');
  });
});


module.exports = server;