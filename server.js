const express = require('express');
const server = express();
const path = require("path"); // Handle file path
const port = 1500;

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use(express.static(path.join(__dirname, 'public')))

const users = [
    { Name: "Ratnasri", Nickname: "Ratna", Age: 20, Bio: "Student as a software tester."},
    { Name: "Hifza", Nickname: "Mamma", Age: 21, Bio: "Programmer" },
    { Name: "Chama Hakkal", Nickname: "Chacho", Age: 22, Bio: "Tester" },
    {Name: "Shreelakshmi", Nickname: "Shree", Age: 19, Bio: "Software Engineer"},
]


server.get("/users", function (req, resp) {
    resp.render("index", { users: users });
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


server.listen(port, function()  {
  console.log(`The server is listening ${port}`)
})