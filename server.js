const express = require('express');
const server = express();
const port = 1500;

server.get('/', function(req, res)  {
  res.send('Hello World!');
});

server.listen(port, function()  {
  console.log(`The server is listening ${port}`)
})